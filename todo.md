# Projeto DOMUS - TODO

## Funcionalidades Implementadas
- [x] Link Admin condicional em todas as páginas
- [x] Sistema de solicitações melhorado com localStorage sincronizado
- [x] Erro de <a> aninhado corrigido no Admin.tsx

## Nova Aba: Agenda
- [x] Criar hook useEvents para gerenciar eventos com localStorage
- [x] Criar página Agenda.tsx com lista de eventos
- [x] Implementar ordenação automática por data (próximos e realizados)
- [x] Implementar filtros de eventos (Todos, Próximos, Realizados)
- [ ] Criar componente de formulário para admin criar/editar eventos
- [x] Implementar validação de datas e status automático
- [ ] Criar componente de upload de fotos para eventos realizados
- [x] Criar galeria responsiva com lightbox para fotos (estrutura base)
- [x] Adicionar link Agenda no menu de navegação (todas as páginas)
- [x] Criar testes para useEvents
- [ ] Salvar checkpoint final

## Notas
- Manter estilo visual atual do site (cores, tipografia, responsividade)
- Apenas admins podem criar/editar/excluir eventos
- Eventos futuros NÃO exibem fotos
- Eventos realizados exibem galeria de fotos
- Filtros funcionam em tempo real sem recarregar página
