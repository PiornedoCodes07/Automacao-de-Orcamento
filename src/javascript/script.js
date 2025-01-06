// Função para salvar os dados no sessionStorage
function salvarDadosFormulario() {
  const formData = {
    nome: document.getElementById("nome").value,
    telefone: document.getElementById("telefone").value,
    endereco: document.getElementById("endereco").value,
    veiculo: document.getElementById("veiculo").value,
    placa: document.getElementById("placa").value,
    cor: document.getElementById("cor").value,
    ano: document.getElementById("ano").value,
    data: document.getElementById("data").value,
    obs: document.getElementById("obs").value
  };
  sessionStorage.setItem("formOrcamento", JSON.stringify(formData));
}

// Função para restaurar os dados do sessionStorage
function restaurarDadosFormulario() {
  const savedData = JSON.parse(sessionStorage.getItem("formOrcamento"));
  if (savedData) {
    document.getElementById("nome").value = savedData.nome || "";
    document.getElementById("telefone").value = savedData.telefone || "";
    document.getElementById("endereco").value = savedData.endereco || "";
    document.getElementById("veiculo").value = savedData.veiculo || "";
    document.getElementById("placa").value = savedData.placa || "";
    document.getElementById("cor").value = savedData.cor || "";
    document.getElementById("ano").value = savedData.ano || "";
    document.getElementById("data").value = savedData.data || "";
    document.getElementById("obs").value = savedData.obs || "";
  }
}

// Adicionar eventos de input para salvar os dados automaticamente
document.querySelectorAll("#orcamentoForm input").forEach(function (input) {
  input.addEventListener("input", salvarDadosFormulario);
});

// Restaurar dados quando a página for carregada
window.addEventListener("load", restaurarDadosFormulario);

// Função para formatar o número de telefone
function formatPhoneNumber(phoneNumber) {
  // Remove todos os caracteres que não sejam números
  const cleaned = ("" + phoneNumber).replace(/\D/g, "");

  // Verifica se o número tem o tamanho correto
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);

  // Se o número for válido, retorna no formato (99) 99999-9999
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  // Retorna o número original se a formatação falhar
  return phoneNumber;
}

// Função para atualizar o total
function atualizarTotal() {
  let total = 0;
  // Pegando todos os valores inseridos nos campos de preço
  document
    .querySelectorAll("#board .item input[id='price']")
    .forEach(function (input) {
      const valor = parseFloat(input.value) || 0; // Caso o campo esteja vazio, considere 0
      total += valor;
    });
  // Exibir o total no HTML
  document.getElementById("totalOrcamento").textContent = total.toFixed(2);
}

// Função que cria item no Board
document.getElementById("addItemBtn").addEventListener("click", function () {
  // Substituindo o campo de descrição por um select com opções predefinidas
  const select = document.createElement("select");
  select.required = select.style.width = "20%";

  // Tipos de Peças
  const options = [
    { label: "Teto" },
    { label: "Capô" },
    { label: "Tampa Traseira" },
    { label: "Para-Choque D." },
    { label: "Para-Choque T." },
    { label: "Para-lama E" },
    { label: "Para-lama D" },
    { label: "Porta E" },
    { label: "Porta D" },
    { label: "Porta Traseira E." },
    { label: "Porta Traseira D." },
    { label: "Torpedo E" },
    { label: "Torpedo D" },
    { label: "Caixa de Ar E" },
    { label: "Caixa de Ar D" },
    { label: "Lateral E" },
    { label: "Lateral D" },
    { label: "Soleira E" },
    { label: "Soleira D" },
    { label: "Painel D" },
    { label: "Painel Interno D" },
    { label: "Painel T" },
    { label: "Painel Interno T" },
    { label: "Peças" },
    { label: "Nota Fiscal" },
    { label: "Rodas" },
    { label: "Outros" },
  ];

  options.forEach((opt) => {
    const optionElement = document.createElement("option");
    optionElement.value = opt.value;
    optionElement.text = opt.label;
    select.appendChild(optionElement);
  });

  const item = document.createElement("div");
  item.classList.add("item");

  // Ícone de arraste
  const dragIcon = document.createElement("span");
  dragIcon.classList.add("drag-icon");
  dragIcon.innerHTML = "&#8597;"; // Ícone de arraste

  const desc = document.createElement("input");
  desc.type = "text";
  desc.placeholder = "Descrição";
  desc.required = true;
  desc.style.width = "60%";
  desc.setAttribute("id", "descricao");

  // Responsividade
  if (window.innerWidth <= 768) {
    desc.style.width = "50%";
  }

  // Exibir o preço automaticamente baseado na opção selecionada
  const valor = document.createElement("input");
  valor.type = "number";
  valor.placeholder = "Valor";
  valor.required = true;
  valor.style.width = "15%";
  valor.setAttribute("id", "price");
  valor.step = "0.01";

  valor.addEventListener("input", atualizarTotal); // Atualiza o total em tempo real

  const removeBtn = document.createElement("button");
  removeBtn.classList.add("removeBtn");
  removeBtn.textContent = "x";
  removeBtn.addEventListener("click", function () {
    item.remove();
    atualizarTotal(); // Atualiza o total ao remover o item
  });

  item.appendChild(dragIcon);
  item.appendChild(select);
  item.appendChild(desc);
  item.appendChild(valor);
  item.appendChild(removeBtn);

  document.getElementById("board").appendChild(item);

  atualizarTotal(); // Atualiza o total após adicionar um novo item
});

// Tornar o board de itens arrastável
new Sortable(document.getElementById("board"), {
  handle: ".drag-icon", // Define o ícone de arraste como o manipulador
  animation: 150, // Animação suave ao arrastar
});

// Função principal do formulário
document
  .getElementById("orcamentoForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Pegando os inputs
    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const telefoneFormatado = formatPhoneNumber(telefone);
    const endereco = document.getElementById("endereco").value;
    const veiculo = document.getElementById("veiculo").value;
    const placa = document.getElementById("placa").value.toUpperCase();
    const cor = document.getElementById("cor").value;
    const ano_v = document.getElementById("ano").value;
    const data = document.getElementById("data").value;
    const obs = document.getElementById("obs").value;
    const [ano, mes, dia] = data.split("-");
    const datebr = `${dia}/${mes}/${ano}`;

    let totalOrcamento = 0;
    // Pegando valores do input do board
    const items = [];
    document.querySelectorAll("#board .item").forEach(function (itemDiv) {
      const peca = itemDiv.querySelector("select").selectedOptions[0].text;
      const descricao = itemDiv.querySelector("input[id='descricao']").value;
      const price = parseFloat(
        itemDiv.querySelector("input[id='price']").value
      );
      items.push({ peca, descricao, price });
      totalOrcamento += price;
    });

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Template principal
    const img = new Image();
    img.src = "/src/img/template.jpg";

    // Template de continuação
    const imgContinuation = new Image();
    imgContinuation.src = "/src/img/continue.jpg";

    // Desenhando em cima do template principal
    img.onload = function () {
      doc.addImage(
        img,
        "JPG",
        0,
        0,
        doc.internal.pageSize.width,
        doc.internal.pageSize.height
      );

      doc.setFont("Helvetica");
      doc.setFontSize(12);

      // Dados do Cliente
      doc.text(8, 60, nome);
      doc.text(8, 67, endereco);
      doc.text(8, 74, telefoneFormatado);
      // Dados do Veículo
      doc.text(35, 89, veiculo);
      doc.text(81, 89, placa);
      doc.text(128, 89, cor);
      doc.text(173, 89, ano_v);
      // Observações
      doc.setFontSize(12);
      doc.setTextColor(255, 49, 50);
      doc.setFont("Helvetica", "bold");
      const obsFormat = doc.splitTextToSize(obs, 89);
      doc.text(120, 263, obsFormat);

      // DATA
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.setFont("Helvetica", "bold");
      doc.text(165, 49, datebr);

      let ypos = 110;
      let linesCount = 0;

      items.forEach((item, index) => {
        if (linesCount >= 15) {
          // Adiciona nova página com o template de continuação
          doc.addPage();
          doc.addImage(
            imgContinuation,
            "JPG",
            0,
            0,
            doc.internal.pageSize.width,
            doc.internal.pageSize.height
          );
          ypos = 40; // Começar em uma nova posição na página de continuação
          linesCount = 0; // Reinicia a contagem de linhas para a nova página
        }

        doc.setFontSize(12);
        doc.setFont("Helvetica");
        doc.setTextColor(0, 0, 0);
        doc.text(13, ypos, item.peca);
        doc.text(57, ypos, item.descricao);
        doc.text(175, ypos, item.price.toString());
        ypos += 7;
        linesCount++;
      });

      // Adicionando o valor total de todos os itens do orçamento apenas na primeira página
      if (items.length > 0) {
        //Pegando numero de paginas
        const paginas = doc.getNumberOfPages();
        if (paginas > 1) {
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(20);
          doc.text(140, 280, "TOTAL: R$" + totalOrcamento.toString());
        } else {
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(20);
          doc.text(140, 220, "TOTAL: R$" + totalOrcamento.toString());
        }
      }
      doc.save(`Orcamento_${nome} ${data}.pdf`);
    };
  });
