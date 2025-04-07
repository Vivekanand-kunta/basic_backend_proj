document.addEventListener("DOMContentLoaded", () => {
    const dataDetail = document.getElementById("data-detail");
    const updateBtn = document.getElementById("update-btn");
    const deleteBtn = document.getElementById("delete-btn");
    const updateFormContainer = document.getElementById("update-form-container");
    const updateForm = document.getElementById("update-form");
    const cancelBtn = document.getElementById("cancel-btn");
    const nameInput = document.getElementById("name-input");
    const tempInput = document.getElementById("temp-input");
    const ppmInput = document.getElementById("ppm-input");
    const comfortInput = document.getElementById("comfort-input");

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    fetchData(id);

    updateBtn.addEventListener("click", () => {
        
        updateFormContainer.style.display = "block";
        updateBtn.style.display = "none"; 
        deleteBtn.style.display = "none";
    
        fetch(`/api/data/${id}`)
            .then(response => response.json())
            .then(item => {
                nameInput.value = item.name;
                tempInput.value = item.temp;
                ppmInput.value = item.ppm;
                comfortInput.value = item.comfort;
            });
    });

    updateForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const updatedData = {
            name: nameInput.value,
            temp: parseFloat(tempInput.value),
            ppm: parseInt(ppmInput.value),
            comfort: comfortInput.value
        };

        await fetch(`/api/data/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData)
        });

        updateFormContainer.style.display = "none";
        updateBtn.style.display = "inline";
        deleteBtn.style.display = "inline";
        fetchData(id);
    });

    cancelBtn.addEventListener("click", () => {
    
        updateFormContainer.style.display = "none";
        updateBtn.style.display = "inline";
        deleteBtn.style.display = "inline";
    });

    deleteBtn.addEventListener("click", async () => {
        if (confirm("Are you sure you want to delete this item?")) {
            await fetch(`/api/data/${id}`, {
                method: "DELETE"
            });
            window.location.href = "/project/data.html";
        }
    });

    async function fetchData(id) {
        const response = await fetch(`/api/data/${id}`);
        const item = await response.json();
        dataDetail.innerHTML = `
            <h2>${item.name}</h2>
            <p>Temperature: ${item.temp}°C</p>
            <p>PPM: ${item.ppm}</p>
            <p>Comfort: ${item.comfort}</p>
            <p>ID: ${item._id}</p>
            <p>Created: ${new Date(item.createdAt).toLocaleString()}</p>
        `;
    }
});