class FormSubmit {
    constructor(settings) {
        this.settings = settings; // Armazena as configurações passadas para o construtor
        this.form = document.querySelector(settings.form); // Seleciona o formulário com base na configuração passada
        this.formButton = document.querySelector(settings.button); // Seleciona o botão do formulário com base na configuração passada
        if (this.form) {
            this.url = this.form.getAttribute("action"); // Obtém a URL de destino do formulário se estiver definida
        }
        this.sendForm = this.sendForm.bind(this); // Associa a função sendForm ao contexto atual da instância
    }

    displaySuccess() {
        this.form.innerHTML = this.settings.success; // Exibe uma mensagem de sucesso no formulário
    }

    displayError(message) {
        this.form.innerHTML = `<h1 class='error' style='text-align: center;'>${message}</h1>`; // Exibe uma mensagem de erro no formulário
    }

    getFormObject() {
        const formObject = {}; // Inicializa um objeto para armazenar os dados do formulário
        const fields = this.form.querySelectorAll("[name]"); // Seleciona todos os campos do formulário
        fields.forEach((field) => {
            formObject[field.getAttribute("name")] = field.value; // Adiciona os valores dos campos ao objeto formObject
        });
        return formObject; // Retorna o objeto com os dados do formulário
    }

    validateForm() {
        const requiredFields = this.form.querySelectorAll("[required]"); // Seleciona todos os campos obrigatórios do formulário
        let isValid = true; // Inicializa uma variável para indicar se o formulário é válido ou não

        requiredFields.forEach((field) => {
            const value = field.value.trim(); // Obtém e limpa o valor do campo
            if (!value) {
                isValid = false; // Se algum campo obrigatório estiver vazio, define isValid como false
            }
        });

        return isValid; // Retorna se o formulário é válido ou não
    }

    onSubmission(evento) {
        evento.preventDefault(); // Impede o comportamento padrão de envio do formulário
        evento.target.disabled = true; // Desabilita o botão de envio do formulário
        evento.target.innerText = "Enviando...."; // Altera o texto do botão de envio do formulário para indicar que está sendo enviado
    }

    async sendForm(evento) {
        try {
            this.onSubmission(evento); // Realiza as ações necessárias antes de enviar o formulário

            if (!this.validateForm()) {
                this.displayError("Por favor, preencha todos os campos obrigatórios."); // Exibe uma mensagem de erro se o formulário não for válido
                return; // Não prossiga se o formulário não for válido
            }

            await fetch(this.url, { // Realiza uma requisição POST para a URL especificada no atributo action do formulário
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(this.getFormObject()), // Envia os dados do formulário como JSON
            });

            this.displaySuccess(); // Exibe uma mensagem de sucesso após o envio bem-sucedido
        } catch (error) {
            this.displayError("Não foi possível enviar sua mensagem."); // Exibe uma mensagem de erro em caso de falha no envio
        }
    }

    init() {
        if (this.form) {
            this.formButton.addEventListener('click', this.sendForm); // Adiciona um ouvinte de evento ao botão do formulário para acionar o envio do formulário
        }
        return this; // Retorna a instância atual para possibilitar o encadeamento de métodos
    }
}

const formSubmit = new FormSubmit({
    form: "[data-form]", // Seletor do formulário
    button: "[data-button]", // Seletor do botão de envio do formulário
    success: "<h1 class='success' style='text-align: center;'>Mensagem enviada!</h1>", // Mensagem de sucesso a ser exibida após o envio do formulário
    error: "<h1 class='error' style='text-align: center;'>Não foi possível enviar sua mensagem.</h1>", // Mensagem de erro a ser exibida em caso de falha no envio do formulário
});

formSubmit.init(); // Inicializa o objeto FormSubmit e configura o envio do formulário
