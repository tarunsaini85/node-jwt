const form = document.querySelector('#signup-form');
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    document.querySelectorAll('.error').forEach(function(errorDiv) {
        errorDiv.style.display = 'none';
        errorDiv.innerHTML = '';
    });

    let name = document.querySelector('#name').value;
    let email = document.querySelector('#email').value;
    let password = document.querySelector('#password').value;
    const payload = {name, email, password};

    
    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then((res) => {
        if(res.status === 201) {
            const form = document.querySelector('#signup-form');
            form.reset();
            form.style.opacity = '0.1';
            const toast = new bootstrap.Toast(document.getElementById('signup-success-toast'));
            document.getElementById('signup-success-toast').style.zIndex = '999';
            toast.show();
            setTimeout(() => {
                window.location.href = '/';
            }, 1700);
        } else {
            res.json().then((data) => {
                if (data.errors) {
                    Object.keys(data.errors).forEach(function(key) {
                        const errorDiv = document.querySelector(`#${key}-error`);
                        errorDiv.innerHTML = data.errors[key];
                        errorDiv.style.display = 'block';
                    });
                }
            })
        }
    })
    .catch((err) => {
        console.error(err);
    })

})