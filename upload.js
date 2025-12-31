const uploadZone = document.getElementById('upload-zone');
const fileInput = document.getElementById('file-input');
const bar = document.getElementById('bar');
const result = document.getElementById('result');

uploadZone.addEventListener('click', ()=> fileInput.click());
uploadZone.addEventListener('dragover', e => e.preventDefault());
uploadZone.addEventListener('drop', e => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
});
fileInput.addEventListener('change', e => handleFile(e.target.files[0]));

async function handleFile(file){
    result.innerHTML = '';
    bar.style.width = '0%';
    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST","https://85.211.245.201:3000/upload");
    
    xhr.upload.onprogress = function(e){
        if(e.lengthComputable){
            let percent = (e.loaded / e.total) * 100;
            bar.style.width = percent + "%";
        }
    };

    xhr.onload = function(){
        if(xhr.status==200){
            let res = JSON.parse(xhr.responseText);
            if(res.success){
                result.innerHTML = `
                    <p>✅ Upload berhasil!</p>
                    <p>Code: <b>${res.code}</b></p>
                    <button onclick="copyCode('${res.code}')">Copy Code</button>
                `;
            } else {
                result.innerHTML = `<p>❌ Error: ${res.message}</p>`;
            }
        } else {
            result.innerHTML = `<p>❌ Upload gagal, status ${xhr.status}</p>`;
        }
    };

    xhr.send(formData);
}

function copyCode(code){
    navigator.clipboard.writeText(code);
    alert('Code disalin: ' + code);
}