// Função que cria item no Board
document.getElementById("addItemBtn").addEventListener("click", function () {
    // Substituindo o campo de descrição por um select com opções predefinidas
    const select = document.createElement('select');
    select.required = select.style.width = '20%';

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
        { label: "Peças" }

    ];

    options.forEach(opt => {
        const optionElement = document.createElement('option');
        optionElement.value = opt.value;
        optionElement.text = opt.label;
        select.appendChild(optionElement);
    });
    ////////////////////////////////////////////

    const item = document.createElement('div');
    item.classList.add('item');
    const desc = document.createElement('input');
    desc.type = 'text';
    desc.placeholder = 'Descrição';
    desc.required = true;
    desc.style.width = '60%';
    desc.setAttribute('id', 'descricao')

    // Responsividade
    if (window.innerWidth <= 768) {
        desc.style.width = '50%';
    }
    


    // Exibir o preço automaticamente baseado na opção selecionada
    const valor = document.createElement('input');
    valor.type = 'number';
    valor.placeholder = 'Valor';
    valor.required = true;
    valor.style.width = '15%';
    valor.setAttribute('id', 'price')
    valor.step = '0.01';

    const removeBtn = document.createElement('button');
    removeBtn.classList.add('removeBtn');
    removeBtn.textContent = 'x';
    removeBtn.addEventListener('click', function () {
        item.remove();
    });

    item.appendChild(select);
    item.appendChild(desc);
    item.appendChild(valor);
    item.appendChild(removeBtn);

    document.getElementById('board').appendChild(item);
});

// Função principal do formulario
document.getElementById("orcamentoForm").addEventListener("submit", function (event) {
    event.preventDefault();

    // Pegando os inputs
    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const endereco = document.getElementById("endereco").value;
    const veiculo = document.getElementById("veiculo").value;
    const placa = document.getElementById("placa").value.toUpperCase();
    const cor = document.getElementById("cor").value;
    const ano_v = document.getElementById("ano").value;
    const data = document.getElementById("data").value;
    const [ano, mes, dia] = data.split('-');
    const datebr = `${dia}/${mes}/${ano}`;

    // Pegando valores do input do boarde somando: 

    //////////////////
    let totalOrcamento = 0;
    // Pegando valores do input do board
    const items = [];
    document.querySelectorAll("#board .item").forEach(function (itemDiv) {
        const peca = itemDiv.querySelector("select").selectedOptions[0].text;
        const descricao = itemDiv.querySelector("input[id= 'descricao']").value;
        const price = parseFloat(itemDiv.querySelector("input[id='price']").value);
        items.push({peca,descricao,price})
        totalOrcamento += price
       
    });
    //////////////////////////////////

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Criando o template padrão
    const img = new Image();
    img.src = "/src/img/template.jpg";

    // Desenhando em cima do template
    img.onload = function () {
        doc.addImage(img, 'JPG', 0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height);

        doc.setFont("Helvetica");
        doc.setFontSize(12);

        // Dados do Cliente
      
        doc.text(8, 60, nome);
        doc.text(8, 67, endereco);
        doc.text(8, 74, telefone);
        // Dados do Veículo
        doc.text(35, 89, veiculo);
        doc.text(81, 89, placa);
        doc.text(128, 89, cor);
        doc.text(173, 89, ano_v);
        // Descrição

        // DATA :
        doc.setFontSize(14);
        doc.setTextColor(255, 255, 255);
        doc.setFont("Helvetica", "bold");
        doc.text(165, 49, datebr);



        let ypos = 110;
        //Posição Y inicial para os itens
        items.forEach(item => {
            doc.setFontSize(12);
            doc.setFont("Helvetica");
            doc.setTextColor(0, 0, 0);
            doc.text(13, ypos, item.peca);
            doc.text(57, ypos, item.descricao);
            doc.text(175, ypos, item.price.toString());
            ypos += 7;
           
            
            
        });

        //Adicionando o valor total de todos os itens do orçamento
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.text(160, 220, totalOrcamento.toString()); // Exibindo o total do orçamento
       
        doc.save(`Orcamento_${nome}.pdf`);
    };
});