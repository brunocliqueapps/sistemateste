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
    ["password", "Senha", "password", true],
    ["phone", "Telefone", "tel"],
    ["department", "Departamento", "text"],
    ["position", "Cargo", "text"],
    ["status", "Estado", "select:Ativo|Inativo"]
  ],
  vacation: [
    ["userId", "Colaborador", "user", true],
    ["origin", "Origem", "select:Admin/RH|Funcionario"],
    ["startDate", "Data inicial", "date", true],
    ["endDate", "Data final", "date", true],
    ["days", "Dias uteis", "number", true],
    ["status", "Estado", "select:Pendente|Aprovado|Rejeitado"],
    ["notes", "Observacoes", "textarea"]
  ],
  absence: [
    ["userId", "Colaborador", "user", true],
    ["date", "Data", "date", true],
    ["type", "Tipo", "select:Justificada|Injustificada|Baixa|Outro"],
    ["status", "Estado", "select:Pendente|Aprovado|Rejeitado"],
    ["reason", "Motivo", "textarea"]
  ]
};

function qs(selector) {
  return document.querySelector(selector);
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
    if (!saved) throw new Error("no state");
    return mergeState(saved);
  } catch {
    const fresh = structuredClone(demoData);
    localStorage.setItem(storageKey, JSON.stringify(fresh));
    return fresh;
  }
}

function mergeState(saved) {
  const merged = structuredClone(demoData);
  Object.assign(merged, saved);
  ["companies", "clients", "users", "orders", "vacations", "absences"].forEach((key) => {
    if (!Array.isArray(merged[key]) || !merged[key].length) merged[key] = structuredClone(demoData[key]);
  });
  if (!merged.activeAccount) merged.activeAccount = "user:user-admin";
  localStorage.setItem(storageKey, JSON.stringify(merged));
  return merged;
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
  render();
}

function account() {
  const [type, id] = state.activeAccount.split(":");
  return { type, id };
}

function currentUser() {
  const current = account();
  return current.type === "user" ? state.users.find((user) => user.id === current.id) : null;
}

function currentClient() {
  const current = account();
  return current.type === "client" ? state.clients.find((client) => client.id === current.id) : null;
}

function isClient() {
  return account().type === "client";
}

function role() {
  return currentUser()?.role || "Cliente";
}

function allowedViews() {
  if (isClient()) return ["clientPortal"];
  if (role() === "Admin") return ["adminPage", "dashboard", "clients", "companies", "orders", "users", "vacations", "absences"];
  if (role() === "RH") return ["rhPage", "users", "vacations", "absences"];
  return ["employeePage", "users", "vacations", "absences"];
}

function defaultView() {
  if (isClient()) return "clientPortal";
  if (role() === "Admin") return "adminPage";
  if (role() === "RH") return "rhPage";
  return "employeePage";
}

function setView(view) {
  currentView = allowedViews().includes(view) ? view : defaultView();
  Object.entries(views).forEach(([name, element]) => element?.classList.toggle("active", name === currentView));
  qsa(".nav-item").forEach((button) => {
    button.hidden = !allowedViews().includes(button.dataset.view);
    button.classList.toggle("active", button.dataset.view === currentView);
  });
  qs("#pageTitle").textContent = titles[currentView][0];
  qs("#pageSubtitle").textContent = titles[currentView][1];
  qs("#newRecordButton").textContent = actionLabel();
  qs("#newRecordButton").hidden = !canCreateHere();
}

function qsa(selector) {
  return [...document.querySelectorAll(selector)];
}

function actionLabel() {
  return {
    adminPage: "Nova encomenda",
    dashboard: "Novo cliente",
    clients: "Novo cliente",
    companies: "Nova empresa",
    orders: "Nova encomenda",
    users: "Novo colaborador",
    rhPage: "Adicionar ferias",
    employeePage: "Pedir ferias",
    vacations: "Adicionar ferias",
    absences: "Registar falta"
  }[currentView] || "Novo";
}

function canCreateHere() {
  if (isClient()) return false;
  if (role() === "Admin") return ["adminPage", "dashboard", "clients", "companies", "orders", "users", "vacations", "absences"].includes(currentView);
  if (role() === "RH") return ["rhPage", "vacations", "absences"].includes(currentView);
  return ["employeePage", "vacations", "absences"].includes(currentView);
}

function modeFromView() {
  return { adminPage: "order", dashboard: "client", clients: "client", companies: "company", orders: "order", users: "user", rhPage: "vacation", employeePage: "vacation", vacations: "vacation", absences: "absence" }[currentView] || "client";
}

function render() {
  qs("#loginScreen").hidden = true;
  qs("#appShell").hidden = false;
  renderAccountSelector();
  renderDashboard();
  renderRolePages();
  renderClients();
  renderCompanies();
  renderOrders();
  renderClientPortal();
  renderUsers();
  renderVacations();
  renderAbsences();
  setView(currentView);
}

function renderAccountSelector() {
  const options = [
    ...state.users.map((user) => ({ value: `user:${user.id}`, label: `${user.name} - ${user.role}` })),
    ...state.clients.map((client) => ({ value: `client:${client.id}`, label: `${client.name} - Cliente` }))
  ];
  qs("#demoAccountSelect").innerHTML = options.map((option) => `<option value="${option.value}" ${state.activeAccount === option.value ? "selected" : ""}>${esc(option.label)}</option>`).join("");
  qs("#currentSessionName").textContent = isClient() ? `${currentClient()?.name || "Cliente"} - Cliente` : `${currentUser()?.name || "Utilizador"} - ${role()}`;
  qs("#sessionHint").textContent = isClient() ? "Pode acompanhar as suas encomendas" : role() === "Funcionario" ? "Pode pedir ferias e registar faltas" : "Pode gerir e validar informacao";
}

function renderDashboard() {
  text("#totalClients", state.clients.length);
  text("#totalCompanies", state.companies.length);
  text("#totalUsers", state.users.length);
  text("#pendingVacations", state.vacations.filter((item) => item.status === "Pendente").length);
  compact("#recentClients", state.clients.slice(0, 4), (client) => ({ title: client.name, meta: `${companyName(client.companyId)} - ${client.email}`, badge: client.status }));
  compact("#pendingVacationList", state.vacations.filter((item) => item.status === "Pendente"), (item) => ({ title: userName(item.userId), meta: `${date(item.startDate)} a ${date(item.endDate)} - ${item.days} dias`, badge: item.origin }));
}

function renderRolePages() {
  const openOrders = state.orders.filter((order) => !["Concluido", "Entregue"].includes(order.status));
  text("#adminOpenOrders", openOrders.length);
  text("#adminClientLogins", state.clients.filter((client) => client.email && client.password).length);
  text("#adminPendingVacations", state.vacations.filter((item) => item.status === "Pendente").length);
  text("#adminPendingAbsences", state.absences.filter((item) => item.status === "Pendente").length);
  compact("#adminOrdersList", openOrders, (order) => ({ title: `${order.reference} - ${clientName(order.clientId)}`, meta: `${order.status} - ${order.progress}%`, badge: date(order.dueDate) }));
  compact("#rhVacationsList", state.vacations.filter((item) => item.status === "Pendente"), (item) => ({ title: userName(item.userId), meta: `${date(item.startDate)} a ${date(item.endDate)}`, badge: `${item.days} dias` }));
  compact("#rhAbsencesList", state.absences.filter((item) => item.status === "Pendente"), (item) => ({ title: userName(item.userId), meta: item.reason || "Sem motivo", badge: item.type }));
  const employeeId = currentUser()?.id || "user-funcionario";
  const vacations = state.vacations.filter((item) => item.userId === employeeId);
  const approved = sum(vacations.filter((item) => item.status === "Aprovado" && item.origin === "Funcionario"));
  const pending = sum(vacations.filter((item) => item.status === "Pendente" && item.origin === "Funcionario"));
  text("#employeeApprovedDays", approved);
  text("#employeePendingDays", pending);
  text("#employeeAvailableDays", Math.max(15 - approved - pending, 0));
  text("#employeePendingAbsences", state.absences.filter((item) => item.userId === employeeId && item.status === "Pendente").length);
  compact("#employeeVacationsList", vacations, (item) => ({ title: `${date(item.startDate)} a ${date(item.endDate)}`, meta: `${item.days} dias - ${item.origin}`, badge: item.status }));
  compact("#employeeAbsencesList", state.absences.filter((item) => item.userId === employeeId), (item) => ({ title: date(item.date), meta: item.reason, badge: item.status }));
}

function renderClients() {
  const query = value("#clientSearch");
  const rows = state.clients.filter((client) => search([client.name, client.email, client.phone, client.status, companyName(client.companyId)], query));
  table("#clientsTable", rows, (client) => `
    <tr>
      <td><strong>${esc(client.name)}</strong><small>${esc(client.role || "Sem cargo")}</small></td>
      <td>${esc(companyName(client.companyId))}</td>
      <td><strong>${esc(client.email)}</strong><small>${esc(client.phone || "Sem telefone")}</small></td>
      <td><span class="status ${cls(client.status)}">${esc(client.status)}</span></td>
      <td>${esc(client.owner || "Admin")}</td>
      <td><div class="row-actions"><button class="row-action" data-edit-client="${client.id}">Editar</button><button class="row-action" data-new-client-order="${client.id}">Nova encomenda</button><button class="row-action delete" data-delete-client="${client.id}">Apagar</button></div></td>
    </tr>`);
}

function renderCompanies() {
  const query = value("#companySearch");
  const rows = state.companies.filter((company) => search([company.name, company.vat, company.email, company.city, company.sector], query));
  table("#companiesTable", rows, (company) => `
    <tr>
      <td><strong>${esc(company.name)}</strong><small>${esc(company.address || "Sem morada")}</small></td>
      <td>${esc(company.vat || "Sem NIF")}</td>
      <td><strong>${esc(company.email || "Sem email")}</strong><small>${esc(company.phone || "Sem telefone")}</small></td>
      <td>${esc(company.city || "Sem cidade")}</td>
      <td>${esc(company.sector || "Sem setor")}</td>
      <td><div class="row-actions"><button class="row-action" data-edit-company="${company.id}">Editar</button><button class="row-action delete" data-delete-company="${company.id}">Apagar</button></div></td>
    </tr>`);
}

function renderOrders() {
  const query = value("#orderSearch");
  const rows = state.orders.filter((order) => search([order.reference, order.title, order.status, clientName(order.clientId), order.weeklyUpdate], query));
  table("#ordersTable", rows, (order) => `
    <tr>
      <td><strong>${esc(order.reference)}</strong><small>${esc(order.title)}</small></td>
      <td>${esc(clientName(order.clientId))}</td>
      <td><span class="status ${cls(order.status)}">${esc(order.status)}</span></td>
      <td><strong>${esc(order.progress)}%</strong><small>Previsao: ${date(order.dueDate)}</small></td>
      <td>${esc(order.weeklyUpdate || "Sem atualizacao")}</td>
      <td><div class="row-actions"><button class="row-action" data-edit-order="${order.id}">Editar</button><button class="row-action delete" data-delete-order="${order.id}">Apagar</button></div></td>
    </tr>`);
}

function renderClientPortal() {
  const clientId = currentClient()?.id;
  const rows = state.orders.filter((order) => order.clientId === clientId);
  table("#clientOrdersTable", rows, (order) => `
    <tr>
      <td><strong>${esc(order.reference)}</strong><small>${esc(order.title)}</small></td>
      <td><span class="status ${cls(order.status)}">${esc(order.status)}</span></td>
      <td><strong>${esc(order.progress)}%</strong><small>${esc(order.description || "")}</small></td>
      <td>${date(order.dueDate)}</td>
      <td>${esc(order.weeklyUpdate || "Sem atualizacao semanal")}</td>
    </tr>`);
}

function renderUsers() {
  const query = value("#userSearch");
  const rows = (role() === "Funcionario" ? state.users.filter((user) => user.id === currentUser()?.id) : state.users).filter((user) => search([user.name, user.email, user.role, user.department], query));
  table("#usersTable", rows, (user) => {
    const total = sum(state.vacations.filter((item) => item.userId === user.id && item.status !== "Rejeitado"));
    return `<tr>
      <td><strong>${esc(user.name)}</strong><small>${esc(user.position || "Sem cargo")}</small></td>
      <td><span class="status ${cls(user.role)}">${esc(user.role)}</span></td>
      <td><strong>${esc(user.email)}</strong><small>${esc(user.phone || "Sem telefone")}</small></td>
      <td>${esc(user.department || "Sem departamento")}</td>
      <td><strong>${total}/30 dias</strong><small>Limite anual</small></td>
      <td><div class="row-actions">${role() === "Admin" ? `<button class="row-action" data-edit-user="${user.id}">Editar</button><button class="row-action delete" data-delete-user="${user.id}">Apagar</button>` : ""}</div></td>
    </tr>`;
  });
}

function renderVacations() {
  const query = value("#vacationSearch");
  const rows = state.vacations.filter((item) => role() !== "Funcionario" || item.userId === currentUser()?.id).filter((item) => search([userName(item.userId), item.origin, item.status, item.notes], query));
  table("#vacationsTable", rows, (item) => `
    <tr>
      <td><strong>${esc(userName(item.userId))}</strong><small>${esc(item.notes || "Sem observacoes")}</small></td>
      <td><strong>${date(item.startDate)} a ${date(item.endDate)}</strong><small>Validado por: ${esc(item.decidedBy || "pendente")}</small></td>
      <td>${esc(item.days)}</td>
      <td>${esc(item.origin)}</td>
      <td><span class="status ${cls(item.status)}">${esc(item.status)}</span></td>
      <td><div class="row-actions">${role() !== "Funcionario" ? `<button class="row-action" data-edit-vacation="${item.id}">Editar</button><button class="row-action approve" data-approve-vacation="${item.id}">Aprovar</button><button class="row-action delete" data-reject-vacation="${item.id}">Rejeitar</button>` : ""}</div></td>
    </tr>`);
}

function renderAbsences() {
  const query = value("#absenceSearch");
  const rows = state.absences.filter((item) => role() !== "Funcionario" || item.userId === currentUser()?.id).filter((item) => search([userName(item.userId), item.type, item.status, item.reason], query));
  table("#absencesTable", rows, (item) => `
    <tr>
      <td>${esc(userName(item.userId))}</td>
      <td>${date(item.date)}</td>
      <td>${esc(item.type)}</td>
      <td><span class="status ${cls(item.status)}">${esc(item.status)}</span></td>
      <td>${esc(item.reason || "Sem motivo")}</td>
      <td><div class="row-actions">${role() !== "Funcionario" ? `<button class="row-action" data-edit-absence="${item.id}">Editar</button><button class="row-action approve" data-approve-absence="${item.id}">Validar</button><button class="row-action delete" data-reject-absence="${item.id}">Rejeitar</button>` : ""}</div></td>
    </tr>`);
}

function openDialog(mode, id = null, defaults = {}) {
  dialogMode = mode;
  editingId = id;
  const record = id ? collection(mode).find((item) => item.id === id) : { ...defaultRecord(mode), ...defaults };
  qs("#dialogTitle").textContent = `${id ? "Editar" : "Novo"} ${label(mode)}`;
  qs("#dialogSubtitle").textContent = "Preencha os dados principais.";
  qs("#formAlert").textContent = "";
  qs("#formFields").innerHTML = forms[mode].map((field) => fieldHtml(field, record || {})).join("");
  qs("#recordDialog").showModal();
}

function fieldHtml([name, labelText, type, required], record) {
  const valueText = record[name] || "";
  const req = required ? "required" : "";
  if (type === "textarea") return `<label class="field full"><span>${labelText}</span><textarea name="${name}" ${req}>${esc(valueText)}</textarea></label>`;
  if (type === "company") return selectField(name, labelText, state.companies.map((item) => [item.id, item.name]), valueText, req);
  if (type === "client") return selectField(name, labelText, state.clients.map((item) => [item.id, item.name]), valueText, req);
  if (type === "user") return selectField(name, labelText, state.users.map((item) => [item.id, item.name]), valueText, req);
  if (type.startsWith("select:")) return selectField(name, labelText, type.replace("select:", "").split("|").map((item) => [item, item]), valueText, req);
  return `<label class="field"><span>${labelText}</span><input name="${name}" type="${type}" value="${esc(valueText)}" ${req}></label>`;
}

function selectField(name, labelText, options, valueText, req) {
  return `<label class="field"><span>${labelText}</span><select name="${name}" ${req}>${options.map(([valueOption, labelOption]) => `<option value="${esc(valueOption)}" ${valueText === valueOption ? "selected" : ""}>${esc(labelOption)}</option>`).join("")}</select></label>`;
}

function handleSubmit(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  const target = collection(dialogMode);
  if (editingId) {
    const index = target.findIndex((item) => item.id === editingId);
    target[index] = { ...target[index], ...data };
  } else {
    target.push({ id: `${dialogMode}-${Date.now()}`, ...data });
  }
  qs("#recordDialog").close();
  saveState();
}

function collection(mode) {
  return { client: state.clients, company: state.companies, order: state.orders, user: state.users, vacation: state.vacations, absence: state.absences }[mode];
}

function defaultRecord(mode) {
  if (mode === "order") return { clientId: state.clients[0]?.id, status: "Recebido", progress: "0" };
  if (mode === "vacation") return { userId: currentUser()?.id || "user-funcionario", origin: role() === "Funcionario" ? "Funcionario" : "Admin/RH", status: role() === "Funcionario" ? "Pendente" : "Aprovado" };
  if (mode === "absence") return { userId: currentUser()?.id || "user-funcionario", type: "Justificada", status: "Pendente" };
  if (mode === "user") return { role: "Funcionario", status: "Ativo" };
  if (mode === "client") return { companyId: state.companies[0]?.id, status: "Ativo", password: "cliente123" };
  return {};
}

function label(mode) {
  return { client: "cliente", company: "empresa", order: "encomenda", user: "colaborador", vacation: "ferias", absence: "falta" }[mode];
}

function deleteRecord(mode, id) {
  if (!confirm(`Apagar ${label(mode)}?`)) return;
  const key = { client: "clients", company: "companies", order: "orders", user: "users", vacation: "vacations", absence: "absences" }[mode];
  state[key] = state[key].filter((item) => item.id !== id);
  saveState();
}

function approve(mode, id, status) {
  const item = collection(mode).find((record) => record.id === id);
  if (!item) return;
  item.status = status;
  item.decidedBy = currentUser()?.name || "Admin";
  saveState();
}

function compact(selector, items, mapper) {
  const element = qs(selector);
  if (!element) return;
  if (!items.length) {
    element.innerHTML = `<div class="empty-state">Sem registos.</div>`;
    return;
  }
  element.innerHTML = items.slice(0, 5).map((item) => {
    const view = mapper(item);
    return `<article class="compact-item"><div><strong>${esc(view.title)}</strong><small>${esc(view.meta)}</small></div><span class="status">${esc(view.badge)}</span></article>`;
  }).join("");
}

function table(selector, rows, mapper) {
  const tbody = qs(selector);
  if (!tbody) return;
  tbody.innerHTML = rows.length ? rows.map(mapper).join("") : qs("#emptyStateTemplate").innerHTML;
}

function text(selector, valueText) {
  const element = qs(selector);
  if (element) element.textContent = valueText;
}

function value(selector) {
  return qs(selector)?.value.trim().toLowerCase() || "";
}

function search(parts, query) {
  return parts.join(" ").toLowerCase().includes(query);
}

function sum(items) {
  return items.reduce((total, item) => total + Number(item.days || 0), 0);
}

function companyName(id) {
  return state.companies.find((item) => item.id === id)?.name || "Sem empresa";
}

function clientName(id) {
  return state.clients.find((item) => item.id === id)?.name || "Sem cliente";
}

function userName(id) {
  return state.users.find((item) => item.id === id)?.name || "Sem colaborador";
}

function date(valueText) {
  if (!valueText) return "Sem data";
  return new Intl.DateTimeFormat("pt-PT").format(new Date(`${valueText}T00:00:00`));
}

function cls(valueText) {
  return String(valueText || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[\/\s]+/g, "-");
}

function esc(valueText) {
  return String(valueText ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

qsa(".nav-item").forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
qsa("[data-view-jump]").forEach((button) => button.addEventListener("click", () => setView(button.dataset.viewJump)));
qs("#demoAccountSelect").addEventListener("change", (event) => {
  state.activeAccount = event.target.value;
  saveState();
  setView(defaultView());
});
qs("#newRecordButton").addEventListener("click", () => openDialog(modeFromView()));
qs("#addClientButton").addEventListener("click", () => openDialog("client"));
qs("#addCompanyButton").addEventListener("click", () => openDialog("company"));
qs("#addOrderButton").addEventListener("click", () => openDialog("order"));
qs("#addUserButton").addEventListener("click", () => openDialog("user"));
qs("#addVacationButton").addEventListener("click", () => openDialog("vacation"));
qs("#addAbsenceButton").addEventListener("click", () => openDialog("absence"));
qs("#employeeVacationShortcut").addEventListener("click", () => openDialog("vacation"));
qs("#recordForm").addEventListener("submit", handleSubmit);
qs("#closeDialogButton").addEventListener("click", () => qs("#recordDialog").close());
qs("#cancelDialogButton").addEventListener("click", () => qs("#recordDialog").close());
qs("#exportButton").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "duomold-demo.json";
  link.click();
});
["client", "company", "order", "user", "vacation", "absence"].forEach((name) => qs(`#${name}Search`)?.addEventListener("input", render));

document.addEventListener("click", (event) => {
  const target = event.target;
  const action = [
    ["edit-client", "client", openDialog], ["delete-client", "client", deleteRecord],
    ["edit-company", "company", openDialog], ["delete-company", "company", deleteRecord],
    ["edit-order", "order", openDialog], ["delete-order", "order", deleteRecord],
    ["edit-user", "user", openDialog], ["delete-user", "user", deleteRecord],
    ["edit-vacation", "vacation", openDialog], ["edit-absence", "absence", openDialog]
  ].find(([key]) => target.closest(`[data-${key}]`));
  if (action) {
    const [key, mode, fn] = action;
    fn(mode, target.closest(`[data-${key}]`).dataset[toDatasetKey(key)]);
  }
  if (target.closest("[data-new-client-order]")) openDialog("order", null, { clientId: target.closest("[data-new-client-order]").dataset.newClientOrder });
  if (target.closest("[data-approve-vacation]")) approve("vacation", target.closest("[data-approve-vacation]").dataset.approveVacation, "Aprovado");
  if (target.closest("[data-reject-vacation]")) approve("vacation", target.closest("[data-reject-vacation]").dataset.rejectVacation, "Rejeitado");
  if (target.closest("[data-approve-absence]")) approve("absence", target.closest("[data-approve-absence]").dataset.approveAbsence, "Aprovado");
  if (target.closest("[data-reject-absence]")) approve("absence", target.closest("[data-reject-absence]").dataset.rejectAbsence, "Rejeitado");
});

function toDatasetKey(key) {
  return key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

setView(defaultView());
render();
