
# Criar
/start


# Responder
/answer/index(1-4)
- muda o state se decidir algo stop/errar
- Muda o questionState = answerded
## Flow
- Ver se certa
    - Retornar fim e encerrar tudo
        - Atualizar historico
    - Msg sucesso    
- Atualizar prizes
- Atulizar states (state, hint state...)

# Get New
/next

## Flow
- Se já estive asnwered, muda
- Atualizar historic



# Hint
- Pedir na url /match/hint
    - poder ser ?half ou ?universitary
    - para pular é /match/skip
- Muda o status daquela match
- Se já tiver pedido, devolver a dica correspondente