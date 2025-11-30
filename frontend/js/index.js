document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.login-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                if (data.role === 'aluno') {
                    window.location.href = 'dashboard-aluno.html';
                } else if (data.role === 'professor') {
                    window.location.href = 'dashboard-professor.html';
                } else if (data.role === 'responsavel') {
                    window.location.href = 'dashboard-responsavel.html';
                }
            } else {
                alert(data.message || 'Erro no login');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro no servidor');
        }
    });
});
