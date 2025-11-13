function handleLogin(event) {
    event.preventDefault();
    // اضافه شدن .trim() برای حذف فاصله های احتمالی در ابتدا و انتها
    const email = document.getElementById('login-email').value.trim(); 
    const password = document.getElementById('login-password').value.trim(); 
    const submitBtn = document.getElementById('login-submit');

    // ... ادامه کد ...
    if (email === 'test@gmail.com' && password === '12345@test') {
        // ... success logic ...
