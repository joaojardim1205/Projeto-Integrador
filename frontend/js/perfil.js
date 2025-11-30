// perfil.js - Funcionalidades da página de perfil

// Carregar dados do usuário baseado no papel
async function carregarPerfil() {
    try {
        // Simular busca de dados do usuário (em produção, viria da API)
        const userData = await buscarDadosUsuario();

        // Preencher informações básicas
        document.getElementById('nome').value = userData.full_name || '';
        document.getElementById('email').value = userData.email || '';
        document.getElementById('telefone').value = userData.phone || '';

        // Ajustar interface baseado no papel do usuário
        ajustarInterfacePorPapel(userData.role, userData);

        // Preencher dados específicos do papel
        preencherDadosEspecificos(userData);

        // Atualizar informações da conta
        atualizarDadosConta(userData);

    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        mostrarMensagemErro('Erro ao carregar dados do perfil');
    }
}

// Buscar dados do usuário via API
async function buscarDadosUsuario() {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Usuário não autenticado');
    }

    try {
        const response = await fetch('http://localhost:5000/api/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar dados do usuário');
        }

        const userData = await response.json();

        // Adicionar dados simulados para campos não disponíveis na API
        // Em produção, esses campos viriam da API quando implementados
        const papelUsuario = userData.role;

        const dadosAdicionaisPorPapel = {
            professor: {
                full_name: 'Professor',
                cpf: '',
                phone: '',
                birth_date: '',
                formation: '',
                subjects: [],
                bio: ''
            },
            aluno: {
                full_name: 'Aluno',
                enrollment: '',
                birth_date: '',
                phone: '',
                address: '',
                special_needs: null
            },
            responsavel: {
                full_name: 'Responsável',
                cpf: '',
                phone: '',
                relationship: '',
                occupation: ''
            },
            coordinator: {
                full_name: 'Coordenador',
                cpf: '',
                phone: '',
                department: ''
            }
        };

        return {
            ...userData,
            ...dadosAdicionaisPorPapel[papelUsuario] || dadosAdicionaisPorPapel.professor
        };
    } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        throw error;
    }
}

// Ajustar interface baseado no papel do usuário
function ajustarInterfacePorPapel(papel, dados) {
    const titulo = document.querySelector('.page-header h1');
    const descricao = document.querySelector('.page-header p');
    const userProfileLink = document.querySelector('.user-profile-link');

    // Atualizar título e descrição
    switch (papel) {
        case 'professor':
            titulo.textContent = 'Meu Perfil - Professor';
            descricao.textContent = 'Gerencie suas informações pessoais e configurações da conta docente.';
            userProfileLink.textContent = `👤 Prof. ${dados.full_name}`;
            break;
        case 'student':
            titulo.textContent = 'Meu Perfil - Aluno';
            descricao.textContent = 'Visualize e atualize suas informações pessoais.';
            userProfileLink.textContent = `👤 ${dados.full_name}`;
            break;
        case 'parent':
            titulo.textContent = 'Meu Perfil - Responsável';
            descricao.textContent = 'Gerencie suas informações e acompanhe seus filhos.';
            userProfileLink.textContent = `👤 ${dados.full_name}`;
            break;
        case 'coordinator':
            titulo.textContent = 'Meu Perfil - Coordenador';
            descricao.textContent = 'Gerencie suas informações e configurações administrativas.';
            userProfileLink.textContent = `👤 Coord. ${dados.full_name}`;
            break;
    }

    // Ajustar menu lateral baseado no papel
    ajustarMenuLateral(papel);
}

// Ajustar menu lateral baseado no papel
function ajustarMenuLateral(papel) {
    const sidebarMenu = document.querySelector('.sidebar-menu');

    // Limpar menu atual
    sidebarMenu.innerHTML = '';

    // Menu base para todos
    let menuItems = [
        { href: 'notificacoes.html', text: '🔔 Notificações' },
        { href: 'perfil.html', text: '⚙️ Perfil', active: true }
    ];

    // Adicionar itens específicos por papel
    switch (papel) {
        case 'professor':
            menuItems.unshift(
                { href: 'dashboard-professor.html', text: '🏠 Dashboard' },
                { href: 'lancar-notas.html', text: '📝 Lançar Notas' },
                { href: 'criar-plano-aula.html', text: '📋 Criar Plano' },
                { href: 'gerenciar-turmas.html', text: '👥 Gerenciar Turmas' },
                { href: 'relatorios.html', text: '📊 Relatórios' }
            );
            break;
        case 'student':
            menuItems.unshift(
                { href: 'dashboard-aluno.html', text: '🏠 Dashboard' },
                { href: 'notas-aluno.html', text: '📊 Minhas Notas' },
                { href: 'frequencia-aluno.html', text: '📅 Frequência' },
                { href: 'planos-aluno.html', text: '📚 Planos de Aula' }
            );
            break;
        case 'parent':
            menuItems.unshift(
                { href: 'dashboard-responsavel.html', text: '🏠 Dashboard' },
                { href: 'filhos-responsavel.html', text: '👶 Meus Filhos' },
                { href: 'desempenho-responsavel.html', text: '📊 Desempenho' },
                { href: 'frequencia-responsavel.html', text: '📅 Frequência' },
                { href: 'comunicados-responsavel.html', text: '💬 Comunicados' }
            );
            break;
        case 'coordinator':
            menuItems.unshift(
                { href: 'dashboard-professor.html', text: '🏠 Dashboard' },
                { href: 'gerenciar-turmas.html', text: '👥 Gerenciar Turmas' },
                { href: 'relatorios.html', text: '📊 Relatórios' },
                { href: 'turmas-professor.html', text: '📋 Turmas' },
                { href: 'alunos-professor.html', text: '👨‍🎓 Alunos' }
            );
            break;
    }

    // Adicionar item de sair
    menuItems.push({ href: 'index.html', text: '🚪 Sair' });

    // Renderizar menu
    menuItems.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.href;
        a.textContent = item.text;
        if (item.active) a.classList.add('active');
        li.appendChild(a);
        sidebarMenu.appendChild(li);
    });
}

// Preencher dados específicos do papel
function preencherDadosEspecificos(dados) {
    const form = document.querySelector('.profile-form .form');

    // Limpar campos específicos anteriores
    const camposEspecificos = form.querySelectorAll('.papel-especifico');
    camposEspecificos.forEach(campo => campo.remove());

    // Adicionar campos específicos baseado no papel
    let camposEspecificosHTML = '';

    switch (dados.role) {
        case 'professor':
            camposEspecificosHTML = `
                <div class="form-row papel-especifico">
                    <div class="form-group">
                        <label for="cpf" class="form-label">CPF *</label>
                        <input type="text" id="cpf" class="form-input" value="${dados.cpf || ''}" readonly>
                    </div>
                    <div class="form-group">
                        <label for="data-nascimento" class="form-label">Data de Nascimento</label>
                        <input type="date" id="data-nascimento" class="form-input" value="${dados.birth_date || ''}">
                    </div>
                </div>
                <div class="form-row papel-especifico">
                    <div class="form-group">
                        <label for="disciplina" class="form-label">Disciplinas</label>
                        <input type="text" id="disciplina" class="form-input" value="${dados.subjects ? dados.subjects.join(', ') : ''}" readonly>
                    </div>
                    <div class="form-group">
                        <label for="tempo-servico" class="form-label">Formação</label>
                        <input type="text" id="tempo-servico" class="form-input" value="${dados.formation || ''}" readonly>
                    </div>
                </div>
                <div class="form-group papel-especifico">
                    <label for="biografia" class="form-label">Biografia</label>
                    <textarea id="biografia" class="form-input" rows="4">${dados.bio || ''}</textarea>
                </div>
            `;
            break;

        case 'student':
            camposEspecificosHTML = `
                <div class="form-row papel-especifico">
                    <div class="form-group">
                        <label for="matricula" class="form-label">Matrícula *</label>
                        <input type="text" id="matricula" class="form-input" value="${dados.enrollment || ''}" readonly>
                    </div>
                    <div class="form-group">
                        <label for="data-nascimento" class="form-label">Data de Nascimento *</label>
                        <input type="date" id="data-nascimento" class="form-input" value="${dados.birth_date || ''}" readonly>
                    </div>
                </div>
                <div class="form-group papel-especifico">
                    <label for="endereco" class="form-label">Endereço</label>
                    <textarea id="endereco" class="form-input" rows="3">${dados.address || ''}</textarea>
                </div>
                ${dados.special_needs ? `
                <div class="form-group papel-especifico">
                    <label for="necessidades-especiais" class="form-label">Necessidades Especiais</label>
                    <textarea id="necessidades-especiais" class="form-input" rows="2" readonly>${dados.special_needs}</textarea>
                </div>
                ` : ''}
            `;
            break;

        case 'parent':
            camposEspecificosHTML = `
                <div class="form-row papel-especifico">
                    <div class="form-group">
                        <label for="cpf" class="form-label">CPF *</label>
                        <input type="text" id="cpf" class="form-input" value="${dados.cpf || ''}" readonly>
                    </div>
                    <div class="form-group">
                        <label for="vinculo" class="form-label">Vínculo com Aluno(s)</label>
                        <input type="text" id="vinculo" class="form-input" value="${dados.relationship || ''}" readonly>
                    </div>
                </div>
                <div class="form-group papel-especifico">
                    <label for="ocupacao" class="form-label">Ocupação</label>
                    <input type="text" id="ocupacao" class="form-input" value="${dados.occupation || ''}">
                </div>
            `;
            break;

        case 'coordinator':
            camposEspecificosHTML = `
                <div class="form-row papel-especifico">
                    <div class="form-group">
                        <label for="cpf" class="form-label">CPF *</label>
                        <input type="text" id="cpf" class="form-input" value="${dados.cpf || ''}" readonly>
                    </div>
                    <div class="form-group">
                        <label for="departamento" class="form-label">Departamento</label>
                        <input type="text" id="departamento" class="form-input" value="${dados.department || ''}" readonly>
                    </div>
                </div>
            `;
            break;
    }

    // Inserir campos específicos antes do fechamento do form
    const formEnd = form.querySelector('.form-group:last-of-type');
    formEnd.insertAdjacentHTML('afterend', camposEspecificosHTML);
}

// Atualizar dados da conta
function atualizarDadosConta(dados) {
    const idUsuario = document.querySelector('.card:last-of-type h3:first-of-type + p');
    const dataCadastro = document.querySelector('.card:last-of-type h3:nth-of-type(2) + p');
    const ultimoAcesso = document.querySelector('.card:last-of-type h3:nth-of-type(3) + p');
    const statusConta = document.querySelector('.card:last-of-type .badge');

    if (idUsuario) idUsuario.textContent = `${dados.role.toUpperCase()}-${dados.id.toString().padStart(3, '0')}`;
    if (dataCadastro) dataCadastro.textContent = new Date(dados.created_at).toLocaleDateString('pt-BR');
    if (ultimoAcesso) ultimoAcesso.textContent = new Date(dados.last_login).toLocaleString('pt-BR');
    if (statusConta) {
        statusConta.textContent = dados.is_active ? 'Ativa' : 'Inativa';
        statusConta.className = `badge ${dados.is_active ? 'badge-success' : 'badge-danger'}`;
    }
}

// Funções de manipulação de perfil
function salvarPerfil(event) {
    event.preventDefault();
    // Implementar salvamento
    mostrarMensagemSucesso('Perfil salvo com sucesso!');
}

function alterarSenha(event) {
    event.preventDefault();
    const senhaAtual = document.getElementById('senha-atual').value;
    const novaSenha = document.getElementById('nova-senha').value;
    const confirmarSenha = document.getElementById('confirmar-senha').value;

    if (novaSenha !== confirmarSenha) {
        mostrarMensagemErro('As senhas não coincidem!');
        return;
    }

    // Implementar alteração de senha
    mostrarMensagemSucesso('Senha alterada com sucesso!');
}

function ativar2FA() {
    // Implementar ativação 2FA
    mostrarMensagemSucesso('2FA ativado com sucesso!');
}

function salvarPreferencias(event) {
    event.preventDefault();
    // Implementar salvamento de preferências
    mostrarMensagemSucesso('Preferências salvas com sucesso!');
}

function restaurarPadroes() {
    // Implementar restauração de padrões
    if (confirm('Tem certeza que deseja restaurar as configurações padrão?')) {
        mostrarMensagemSucesso('Configurações restauradas!');
    }
}

function exportarDados() {
    // Implementar exportação de dados
    mostrarMensagemSucesso('Dados exportados com sucesso!');
}

function excluirConta() {
    document.getElementById('deleteModal').style.display = 'block';
}

function fecharDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
}

function confirmarExclusao() {
    const confirmacao = document.getElementById('confirm-delete').value;
    if (confirmacao === 'EXCLUIR') {
        // Implementar exclusão de conta
        mostrarMensagemSucesso('Conta excluída com sucesso!');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    } else {
        mostrarMensagemErro('Confirmação incorreta!');
    }
}

function alterarFoto() {
    // Implementar alteração de foto
    alert('Funcionalidade de alteração de foto em desenvolvimento');
}

function cancelarAlteracoes() {
    if (confirm('Tem certeza que deseja cancelar as alterações?')) {
        carregarPerfil(); // Recarregar dados originais
    }
}

// Funções utilitárias
function mostrarMensagemSucesso(mensagem) {
    // Implementar toast de sucesso
    alert('✅ ' + mensagem);
}

function mostrarMensagemErro(mensagem) {
    // Implementar toast de erro
    alert('❌ ' + mensagem);
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    carregarPerfil();
});
