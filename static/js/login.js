const form = document.querySelector('#login-form');
form.addEventListener('submit', function(e) {
    e.preventDefault();

    let email = document.querySelector('#email').value;
    let password = document.querySelector('#password').value;
    const payload = {email, password};

    
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then((res) => {
        if(res.status === 200) {
            window.location.href = '/profile';
        } else {
            res.json().then((data) => {
                if (data.errors) {
                    document.querySelectorAll('.error').forEach(function(errorDiv) {
                        errorDiv.style.display = 'none';
                        errorDiv.innerHTML = '';
                    });
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