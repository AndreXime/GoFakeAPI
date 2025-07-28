# API Mockup

O APIMockup é uma aplicação de desktop que permite criar e servir endpoints de API falsos de forma rápida e fácil. Com uma interface intuitiva, os desenvolvedores podem configurar rotas, métodos HTTP e respostas JSON personalizadas para simular um backend real, agilizando o desenvolvimento de aplicações frontend.

## Funcionalidades

-   Criação de Endpoints: Adicione novos endpoints de API definindo o método HTTP (GET, POST, PUT, DELETE), o caminho e o corpo da resposta em JSON.

-   Autenticação: Marque endpoints que requerem autenticação para simular rotas protegidas. Um token de autenticação falso é fornecido para testes.

-   Servidor Embutido: Inicie e pare um servidor HTTP local na porta de sua escolha para servir os endpoints criados.

-   Interface Gráfica: Gerencie seus endpoints através de uma interface de usuário amigável, onde é possível visualizar, adicionar e remover rotas ativas.

-   Notificações em Tempo Real: Receba notificações sobre o status do servidor e possíveis erros diretamente na interface.

## Instalação

### Opção 1: Baixar o Binário Pré-compilado (Recomendado)

1.  Acesse a [página de **Releases** do projeto](https://github.com/AndreXime/api-mockup/releases).
2.  Procure pela versão mais recente e baixe o arquivo compatível com o seu sistema operacional.
3.  **(Para macOS e Linux)** Abra o terminal, navegue até a pasta onde está o arquivo e dê permissão de execução para o binário:
    ```bash
    chmod +x <nome-do-executavel>
    ```
4.  Pronto\! Você já pode executar o aplicativo, voce ainda pode configurar para ser global no sistema adicionando no `PATH` _(Linux/macOS)_.

### Opção 2: Compilar do Código-Fonte

Se você tem o **Go** instalado e prefere compilar o projeto manualmente:

1.  Clone o repositório:

    ```bash
    git clone https://github.com/AndreXime/api-mockup.git
    cd api-mockup
    ```

2.  Compile o projeto. O Go irá baixar as dependências e criar o arquivo executável:

    ```bash
    make build
    ```
