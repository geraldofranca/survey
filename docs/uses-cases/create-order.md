# Caso de Uso: Criar Pedido

---

## Descrição
Este caso de uso permite a criação de um novo pedido no sistema. Ele envolve a validação de dados, persistência no banco de dados e notificação de outros sistemas interessados via uma fila de mensagens.

---

## Ator Primário
- **Usuário**: Pode ser um cliente ou operador realizando o pedido através da interface do sistema.
- **Sistema Cliente**: Um sistema externo integrando-se via API para enviar pedidos.

---

## Pré-condições
1. O usuário ou sistema cliente deve estar autenticado e autorizado a criar pedidos.
2. Os serviços dependentes (banco de dados, fila SQS) devem estar disponíveis.

---

## Fluxo Principal

1. **Receber Solicitação**:
   - O sistema recebe uma solicitação via API contendo os detalhes do pedido, que podem incluir:
     - Lista de itens (IDs, quantidades, preços unitários).
     - Informações do cliente (nome, contato, endereço de entrega).
     - Detalhes adicionais (descontos, taxas, observações).

2. **Validar Dados**:
   - O sistema valida as informações recebidas. As validações podem incluir:
     - Checagem de campos obrigatórios (ex.: lista de itens, quantidade).
     - Verificação da consistência dos preços (ex.: valores positivos).
     - Confirmação de que os itens existem no catálogo.
     - Garantia de que o cliente é válido.

3. **Persistir no Banco de Dados**:
   - Se os dados forem válidos:
     - Um novo registro de pedido é criado no banco de dados relacional (PostgreSQL).
     - O status inicial do pedido é definido como "Pendente".
     - Os detalhes do pedido (itens, preços, cliente, etc.) são armazenados.

4. **Publicar Evento na Fila**:
   - O sistema publica um evento na fila SQS com as seguintes informações:
     - Identificador único do pedido.
     - Status inicial ("Pendente").
     - Dados necessários para processamento posterior (ex.: informações do cliente, itens).

5. **Retornar Resposta**:
   - O sistema retorna uma resposta ao usuário ou sistema cliente contendo:
     - Identificador único do pedido.
     - Detalhes do pedido armazenado.
     - Status inicial ("Pendente").

---

## Fluxos Alternativos

### 1. Dados Inválidos
   - Caso os dados fornecidos sejam inválidos:
     - O sistema não cria um registro no banco de dados.
     - Retorna um erro detalhado com a descrição das falhas de validação, como:
       - Campos ausentes.
       - Formatos inválidos.
       - IDs de itens não encontrados.
     - O fluxo principal é encerrado.

### 2. Falha ao Persistir no Banco de Dados
   - Se ocorrer um erro ao tentar criar o registro no banco de dados:
     - O sistema registra o erro em um log.
     - Retorna uma mensagem de erro ao cliente indicando uma falha interna.
     - O evento não é publicado na fila.

### 3. Falha ao Publicar na Fila
   - Se o registro no banco de dados for bem-sucedido, mas a publicação na fila falhar:
     - O sistema registra o erro em um log.
     - Retorna ao cliente o status "Pendente" e um aviso sobre problemas na notificação.
     - Um processo de retentativa ou compensação pode ser iniciado para garantir que o evento seja publicado.

---

## Pós-condições
1. O pedido foi registrado no banco de dados com o status "Pendente".
2. Um evento foi publicado na fila SQS para notificar sistemas dependentes.
3. O cliente ou sistema externo foi informado sobre o sucesso ou falha do processo.

---

## Regras de Negócio
1. Apenas itens disponíveis no catálogo podem ser incluídos no pedido.
2. O preço final do pedido deve ser a soma dos preços unitários multiplicados pelas quantidades, com descontos e taxas aplicados.
3. Clientes bloqueados ou inativos não podem realizar pedidos.

---

## Exemplo de Mensagem de Evento na Fila (SQS)

```json
{
  "orderId": "12345",
  "status": "Pendente",
  "customerId": "67890",
  "items": [
    {
      "itemId": "101",
      "quantity": 2,
      "price": 50.00
    },
    {
      "itemId": "202",
      "quantity": 1,
      "price": 100.00
    }
  ],
  "total": 200.00,
  "createdAt": "2025-01-14T10:00:00Z"
}
```

---

## Notas Técnicas
- **Banco de Dados**: Utilizar transações para garantir consistência entre a gravação do pedido e outras tabelas relacionadas (ex.: estoques).
- **Fila SQS**: Configurar dead-letter queue (DLQ) para lidar com mensagens que não puderem ser entregues.
- **Validação**: Utilizar biblioteca de validação como Zod ou Joi para garantir flexibilidade e clareza na validação de dados.
