const storageKey = "duomold-demo-v3";

const demoData = {
  activeAccount: "user:user-admin",
  companies: [
    { id: "empresa-1", name: "Metal Norte, Lda.", vat: "PT509876321", email: "geral@metalnorte.pt", phone: "+351 255 100 200", city: "Porto", sector: "Metalomecanica", address: "Rua Industrial 120, Porto", notes: "Cliente ativo para acompanhamento de molde." },
    { id: "empresa-2", name: "Plastiform Moldes", vat: "PT514223987", email: "info@plastiform.pt", phone: "+351 244 300 550", city: "Leiria", sector: "Moldes", address: "Zona Industrial, Leiria", notes: "Prospeccao iniciada este mes." }
  ],
  clients: [
    { id: "client-ana", name: "Ana Martins", companyId: "empresa-1", email: "ana@metalnorte.pt", password: "cliente123", phone: "+351 912 345 678", status: "Ativo", owner: "Admin", role: "Compras", notes: "Cliente principal para acompanhamento semanal." },
    { id: "client-carlos", name: "Carlos Silva", companyId: "empresa-2", email: "carlos@plastiform.pt", password: "cliente123", phone: "+351 934 567 210", status: "Prospecto", owner: "Admin", role: "Direcao tecnica", notes: "Aguardar validacao dos dados da empresa." }
  ],
  users: [
    { id: "user-admin", name: "Administrador", email: "admin@empresa.pt", password: "admin123", phone: "+351 900 000 001", role: "Admin", department: "Direcao", position: "Administrador", status: "Ativo" },
    { id: "user-rh", name: "Recursos Humanos", email: "rh@empresa.pt", password: "rh123", phone: "+351 900 000 002", role: "RH", department: "Recursos Humanos", position: "Gestor RH", status: "Ativo" },
    { id: "user-funcionario", name: "Joao Ferreira", email: "joao@empresa.pt", password: "funcionario123", phone: "+351 900 000 003", role: "Funcionario", department: "Producao", position: "Tecnico", status: "Ativo" }
  ],
  orders: [
    { id: "order-1", clientId: "client-ana", reference: "OS-2026-001", title: "Planeamento de molde", description: "Molde tecnico para nova encomenda.", status: "Em producao", progress: "45", dueDate: "2026-06-15", weeklyUpdate: "Molde em fase de planeamento e validacao tecnica.", tasks: "Revisao tecnica; preparacao MOD 54; preparacao MOD 55." },
    { id: "order-2", clientId: "client-carlos", reference: "OS-2026-002", title: "Ajuste de cavidade", description: "Revisao e ajuste de molde existente.", status: "Em analise", progress: "20", dueDate: "2026-06-28", weeklyUpdate: "Equipa tecnica a rever ficheiros enviados.", tasks: "Analise dimensional; contacto com cliente." }
  ],
  vacations: [
    { id: "vac-1", userId: "user-funcionario", startDate: "2026-07-01", endDate: "2026-07-15", days: "15", origin: "Admin/RH", status: "Aprovado", notes: "Periodo definido pela administracao.", decidedBy: "Administrador" },
    { id: "vac-2", userId: "user-funcionario", startDate: "2026-08-10", endDate: "2026-08-14", days: "5", origin: "Funcionario", status: "Pendente", notes: "Pedido do funcionario.", decidedBy: "" }
  ],
  absences: [
    { id: "abs-1", userId: "user-funcionario", date: "2026-05-20", type: "Justificada", status: "Pendente", reason: "Consulta medica", decidedBy: "" }
  ]
};

let state = loadState();
let currentView = "adminPage";
let dialogMode = "client";
let editingId = null;

const views = {
  dashboard: qs("#dashboardView"),
  adminPage: qs("#adminPageView"),
  rhPage: qs("#rhPageView"),
  employeePage: qs("#employeePageView"),
  clients: qs("#clientsView"),
  companies: qs("#companiesView"),
  orders: qs("#ordersView"),
  clientPortal: qs("#clientPortalView"),
  users: qs("#usersView"),
  vacations: qs("#vacationsView"),
  absences: qs("#absencesView")
};

const titles = {
  dashboard: ["Painel", "Visao geral dos clientes, empresas e equipa."],
  adminPage: ["Admin", "Painel administrativo da DUOMOLD."],
  rhPage: ["RH", "Gestao de ferias, faltas e colaboradores."],
  employeePage: ["Funcionario", "Area pessoal para ferias e faltas."],
  clients: ["Clientes", "Cadastro e acesso dos clientes."],
  companies: ["Empresas", "Dados basicos das empresas."],
  orders: ["Encomendas", "Pedidos de clientes e acompanhamento semanal."],
  clientPortal: ["Meu pedido", "Acompanhamento das suas encomendas."],
  users: ["Colaboradores", "Utilizadores Admin, RH e Funcionario."],
  vacations: ["Ferias", "Marcacao, pedido e validacao de ferias."],
  absences: ["Faltas", "Registo e validacao de faltas."]
};

const forms = {
  client: [
    ["name", "Nome do cliente", "text", true],
    ["companyId", "Empresa", "company", true],
    ["email", "Email de acesso", "email", true],
    ["password", "Senha do cliente", "password", true],
    ["phone", "Telefone", "tel"],
    ["status", "Estado", "select:Ativo|Prospecto|Inativo"],
    ["owner", "Responsavel", "text"],
    ["role", "Funcao/cargo", "text"],
    ["notes", "Observacoes", "textarea"]
  ],
  company: [
    ["name", "Nome da empresa", "text", true],
    ["vat", "NIF", "text"],
    ["email", "Email", "email"],
    ["phone", "Telefone", "tel"],
    ["city", "Cidade", "text"],
    ["sector", "Setor", "text"],
    ["address", "Morada", "textarea"],
    ["notes", "Observacoes", "textarea"]
  ],
  order: [
    ["clientId", "Cliente", "client", true],
    ["reference", "Referencia/OS", "text", true],
    ["title", "Titulo", "text", true],
    ["status", "Estado", "select:Recebido|Em analise|Em producao|Aguardando cliente|Concluido|Entregue"],
    ["progress", "Progresso (%)", "number", true],
    ["dueDate", "Previsao de entrega", "date"],
    ["description", "Descricao", "textarea"],
    ["weeklyUpdate", "Atualizacao semanal para o cliente", "textarea"],
    ["tasks", "Tarefas internas", "textarea"]
  ],
  user: [
    ["name", "Nome do colaborador", "text", true],
    ["role", "Perfil", "select:Funcionario|RH|Admin", true],
    ["email", "Email", "email", true],
