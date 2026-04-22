const ACCESS_CODE = "elite-24h-9271-xk";
const API_URL = "https://yzsgzdeqndutzokovqqe.supabase.co/functions/v1/generate-link";


const params = new URLSearchParams(window.location.search);
const access = params.get("access");

const card = document.getElementById("card");
const generateButton = document.getElementById("generateButton");
const copyButton = document.getElementById("copyButton");
const statusText = document.getElementById("status");
const linkBox = document.getElementById("linkBox");
const linkText = document.getElementById("linkText");

if (access !== ACCESS_CODE) {
  card.innerHTML = `
    <span class="badge">ELITESTREAM</span>
    <h1>Acceso no autorizado</h1>
    <p class="lead">No puedes generar un enlace desde esta URL.</p>
  `;
} else {
  generateButton.addEventListener("click", generateLink);
  copyButton.addEventListener("click", copyLink);
  statusText.textContent = "Verificacion correcta. Ya puedes generar tu enlace unico.";
}

async function generateLink() {
  generateButton.disabled = true;
  linkBox.classList.add("hidden");
  statusText.textContent = "Generando enlace unico...";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        access_code: access
      })
    });

    const data = await response.json();

    if (!response.ok || !data.url) {
      throw new Error(data.error || "No se pudo generar el enlace.");
    }

    linkText.textContent = data.url;
    linkBox.classList.remove("hidden");
    statusText.textContent = "Enlace generado correctamente. Solo sirve una vez.";
  } catch (error) {
    statusText.textContent = error.message || "No se pudo generar el enlace.";
  } finally {
    generateButton.disabled = false;
  }
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(linkText.textContent);
    statusText.textContent = "Enlace copiado.";
  } catch {
    statusText.textContent = "No se pudo copiar el enlace.";
  }
}
