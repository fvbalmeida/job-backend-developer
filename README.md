# API - review de filmes

Este projeto foi desenvolvido com o objetivo de permitir que um usuário armazene suas opiniões sobre filmes que já assistiu. A API permite criar, ler, atualizar e excluir reviews de filmes. Tudo isso, utilizando a base de dados da OMDb.

## Processo de desenvolvimento

Apesar de ser um projeto simples, trouxe muito aprendizado e alguns desafios interessantes. 

- O primeiro impasse foi a decisão entre implementar uma abordagem mais automática ou restritiva em relação ao input do usuário na rota de **criação de review**. Basicamente haviam duas opções:  
  1. Deixar o sistema lidar com a questão de títulos iguais.
  2. Permitir que o usuário passe por um certo filtro na hora gravar a review no banco.  
  
  Eu optei pela opção 2. Depois de fazer alguns testes, percebi que não dava, sem front-end, para lidar corretamente com situações assim:
  ```
  {
    "title": "transformers",
    "review": "muito bom!"
  }
  ```
  Neste caso em específico, há mais de um filme dos transformers e existe o filme exatamente com o título transformers(primeiro da franquia). Se eu optasse pela opção 1, corria-se o risco de haver inconsistência nos dados, visto que a única maneira de fazer a requisição passar é inserindo um filme no banco que não necessariamente é o desejado pelo usuário. Neste caso, o primeiro filme da franquia.

  Na opção 2, permiti um body "incrementado", possibilitando ter mais assertividade e consistência na requisição:

  ```
  {
    "title": "transformers",
    "imdbID": "algum-ID"
    "review": "muito bom!"
  }
  ```  

  Desta maneira, caso o usuário passe um id, vou verificar se o título condiz com o id e posteriormente, adicionar a review no banco.  
  Se ele não passar id, retorno uma lista de filmes com títulos semelhantes, juntamente com seus respectivos ids.  

- Um outro problema durante essa feature de criação de review foi o fato de haver paginação na listagem dos filmes. Neste caso, a solução mais viável e menos custosa foi sugerir apenas os primeiros 10 títulos (page 1), e caso o usuário ainda não encontrasse o filme desejado, seria necessário inserir um título mais assertivo. 

- Na feature de contagem de visualizações das reviews, tive que optar por uma abordagem mais tradicional. Novamente eu tinha algumas opções, dentre elas:  
  1. Utilizar **prometheus, grafana, swagger-stats, etc**.
  2. Implementar uma contagem no banco de dados e realizar uma query para mostrar a lista de reviews mais acessadas.

  Optei pela segunda opção por conta da simplicidade do projeto e evitar um *overengineering*. Para chegar no resultado final, implementei um **interceptor** que pega as informações das requisições e salva apenas as que são da rota **GET /movie-reviews/{id}** e que tem **status code 200**. Essa abordagem também é útil caso seja necessário implementar um logger ou alguma métrica de acesso mais específica (dias com mais acessos, locais do país que mais acessam, etc.)

- Em relação aos testes unitários, decidi focar em 100% de cobertura para ter mais métricas sobre a funcionalidade da API. Utilizei mocks de serviços e repositórios, já que o objetivo do teste unitário é testar um componente do sistema e não precisar se preocupar com camadas mais externas (banco de dados).

- Implementei autenticação em algumas rotas utilizando **passport**, uma lib completa para esse fim. A decisão surgiu para viabilizar a proteção das rotas e futuras melhorias, como por exemplo, possibilidade de mais usuários se cadastrarem.

## Estrutura do projeto

Em relação à estrutura da projeto, optei por seguir um padrão mais voltado ao DDD. Claro que DDD não é sobre pastas/arquivos, mas a estrutura delas já adianta o processo de padronização. Gosto muito desse padrão, pois facilita demais a escalabilidade do sistema. Ganhamos modularização, um sistema poderosíssimo de injeção de dependências, e de quebra, um código mais limpo e fácil de ser testado e mantido por outros devs. Fora que a própria modularização nos joga em direção à um processo mais orientado a serviços, facilitando a migração para microsserviços futuramente.

```
\app -> módulos de domínio do sistema
\infra -> componentes de banco de dados e migrations
\shared -> mocks, exceptions personalizadas, interceptor e types.
```

## Deploy

Como já estou familiarizado com AWS, fiz o deploy da API utilizando EC2 e RDS. 

## Instalação e como rodar

Depois de clonar o projeto, entre na pasta principal e dê o comando:

```
npm install
```

Crie o arquivo a seguir na raíz do projeto e popule de acordo com o env.example contido na pasta principal:
```
dev.env
```

Depois disso, inicialize a API pelo docker-compose. Se quiser o bash dos containers integrado ao terminal, remova a flag "-d".

```
docker compose up -d
```

No diretório raiz do projeto, execute o seguinte comando para aplicar as migrations:

```
npm run migration:run
```

Logo após, é só acessar a rota de seed com o método GET para popular o banco com um usuário padrão.

```
localhost:3000/user/seed
```

As credenciais são: 

```
watcher@mail.com
1234
```

Agora o sistema está pronto para uso.


## Testes

Para rodar os testes, basta dar o comando:
```
npm run test
```
