document.addEventListener("DOMContentLoaded", () => {
    const dataList = document.getElementById("data-list");
    const form = document.getElementById("add-data-form");
    const nameInput = document.getElementById("name-input");
    const tempInput = document.getElementById("temp-input");
    const ppmInput = document.getElementById("ppm-input");
    const comfortInput = document.getElementById("comfort-input");

    fetchData();

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const newData = {
            name: nameInput.value,
            temp: parseFloat(tempInput.value),
            ppm: parseInt(ppmInput.value),
            comfort: comfortInput.value
        };

        await fetch("/api/data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newData)
        });
        
        nameInput.value = "";
        tempInput.value = "";
        ppmInput.value = "";
        comfortInput.value = "";
        fetchData();
    });

    async function fetchData() {
        const response = await fetch("/api/data");
        const data = await response.json();
        
        dataList.innerHTML = "";
        data.forEach(item => {
            const div = document.createElement("div");
            div.className = "cube";
            div.innerHTML = `${item.name}<br>Temp: ${item.temp}°C<br>PPM: ${item.ppm}`;
            div.addEventListener("click", () => {
                window.location.href = `/project/data-detail.html?id=${item._id}`; 
            });
            dataList.appendChild(div);
        });
    }
});