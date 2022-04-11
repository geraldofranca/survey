# Padrões REST

## Premissas

- Os nomes das urls e dos atributos devem ser em inglês
- Utilize substantivos no plural, no lugar de verbos, para representar recursos.
    * Exemplo: http://localhost:3333/api/addresses

- Utilize somente letras minúsculas, com hífen "-" para separar palavras.
    * Exemplo: http://localhost:8080/api/professional-classes

- Use sub recursos nos relacionamentos, através do caractere barra "/".
    * Exemplo: http://localhost:3333/api/addresses/cities

- Método GET deve ser utilizado somente em consultas e não deve atualizar informações da aplicação.

- Retorne os dados no formato JSON.
- Utilize nomes de atributos em camel case. Exemplo: professionalClasses
- Utilize boolean no lugar de S/N ou 0/1, em valores binários

## Verbos HTTP

- GET: Consulta
- POST: Inserção
- PUT: Atualizacão
- DELETE: Remoção/inativação

## Códigos de retorno HTTP

### Utilize códigos de retorno HTTP para tratamento de respostas

- 200: OK
    - Consultas
- 201: Registro criado
    - Inserção de registros
- 202: Recurso em processamento
- 204: Sem conteúdo
- 400: Entrada inválida
    - Exemplo: O usuário não preencheu um campo obrigatório
- 401: Sem autenticação ou autenticação inválida
- 403: Sem permissão no recurso
- 404: Registro inexistente
    - Exemplo: Busca de um usuário por ID
- 422: Erros de regras de negócio
    - Exemplo: A porcentagem de entrada deve ser maior que 15%
- 500: Erro inesperado

## Respostas

Todas as respostas devem retornar os atributos status e messages.

Exemplo:

```JSON
{
    "status": "SUCCESS",
    "messages": [{"Process executed successfully"}],
}
```

```JSON
{
    "status": "SUCCESS",
    "messages": [{"Process executed successfully"}],
    "data": [
        { id: 1, name: 'Jonh'}
    ]
}
```

```JSON
{
    "status": "ERROR",
    "messages": [{"An error occurred while executing the process"}]
}
```
