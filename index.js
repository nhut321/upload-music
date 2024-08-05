
document.addEventListener('DOMContentLoaded', () => {
    const baseURL = 'https://api-zing-mp3.onrender.com'
    const loginURL = `${baseURL}/api/account/login`
    const uploadURL = `${baseURL}/api/music/create`

    const loginSection = document.getElementById('loginSection');
    const uploadSection = document.getElementById('uploadSection');
    const loginForm = document.getElementById('loginForm');
    const uploadForm = document.getElementById('uploadForm');
    const uploadStatus = document.getElementById('uploadStatus');

    // Kiểm tra token trong localStorage
    const token = localStorage.getItem('token');
    if (token) {
        loginSection.style.display = 'none';
        uploadSection.style.display = 'block';
    } else {
        loginSection.style.display = 'block';
        uploadSection.style.display = 'none';
    }

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(loginURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.accessToken;
                localStorage.setItem('token', token);
                loginSection.style.display = 'none';
                uploadSection.style.display = 'block';
            } else {
                alert('Đăng nhập không thành công!');
            }
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            alert('Đã xảy ra lỗi khi đăng nhập!');
        }
    });

    uploadForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('src_music', document.getElementById('src_music').files[0]);
        formData.append('image_music', document.getElementById('image_music').files[0]);
        formData.append('name_singer', document.getElementById('name_singer').value);
        formData.append('name_music', document.getElementById('name_music').value);
        formData.append('link_mv', document.getElementById('link_mv').value);
        formData.append('category', document.getElementById('category').value);

        const uploadData = {
            name_singer: document.getElementById('name_singer').value,
            name_music: document.getElementById('name_music').value,
            link_mv: document.getElementById('link_mv').value,
            category: document.getElementById('category').value
        };

        formData.append('upload', JSON.stringify(uploadData));

        const token = localStorage.getItem('token');

        // Hiển thị trạng thái tải lên
        uploadStatus.style.display = 'block';

        try {
            const response = await fetch(uploadURL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            // Ẩn trạng thái tải lên sau khi hoàn thành
            uploadStatus.style.display = 'none';

            if (response.ok) {
                alert('Tải lên thành công!');
            } else {
                alert('Đã xảy ra lỗi!');
            }
        } catch (error) {
            console.error('Lỗi tải lên:', error);
            alert('Đã xảy ra lỗi khi tải lên!');
        }
    });
});

