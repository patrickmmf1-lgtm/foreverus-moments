-- Limpa atividades anteriores para evitar duplicatas
DELETE FROM activities;

-- === PARTE 1: ATIVIDADES PRÁTICAS (Foco em Conexão, Novidade e Toque) ===
INSERT INTO activities (type, title, prompt, category, emoji, duration) VALUES
-- Categoria: Romance & Conexão (Base: John Gottman)
('couple', 'O Mapa do Amor', 'Desenhem juntos um mapa do bairro ou cidade. Marquem 3 lugares que significam muito para a história de vocês e planejem visitar um deles.', 'romance', '🗺️', 45),
('couple', 'O Beijo de 6 Segundos', 'A ciência diz que um beijo de 6 segundos libera ocitocina suficiente para criar conexão real. Pratiquem esse beijo agora e repitam ao sair e chegar em casa.', 'romance', '💋', 5),
('couple', 'Massagem às Cegas', 'Um de vocês recebe uma massagem de 10 minutos vendado. Sem a visão, o toque se torna muito mais intenso.', 'relaxamento', '💆', 20),
('couple', 'Banho à Luz de Velas', 'Tomem um banho juntos apenas com a luz de velas (ou lanterna do celular virada para baixo). O objetivo é relaxar, conversar e lavar as costas um do outro.', 'intimidade', '🕯️', 30),
('couple', 'Dança na Sala', 'Coloquem a música que marcou o início do namoro e dancem abraçados no meio da sala, sem interrupções.', 'romance', '💃', 10),
('couple', 'Olhar Tântrico', 'Sentem-se frente a frente. Coloquem um timer de 2 minutos. Olhem nos olhos um do outro sem falar nada. Apenas respirem.', 'espiritual', '👁️', 5),
('couple', 'Sessão de Elogios', 'Durante 5 minutos, troquem elogios alternados. "Eu amo quando você..." ou "Eu admiro sua...". Proibido repetir.', 'gratidão', '🗣️', 10),
('couple', 'Café na Cama', 'Amanhã de manhã, preparem o café da manhã juntos e comam na cama (ou no sofá) sem celulares por perto.', 'romance', '☕', 40),
('couple', 'Leitura Compartilhada', 'Um lê um capítulo de livro, um poema ou uma notícia positiva em voz alta para o outro, enquanto o outro recebe carinho.', 'relaxamento', '📖', 30),
('couple', 'A Carta de Gratidão', 'Cada um escreve 3 coisas específicas que o outro fez essa semana e pelas quais é grato. Leiam em voz alta.', 'gratidão', '📝', 15),

-- Categoria: Aventura & Novidade (Base: Esther Perel - Quebra de rotina)
('couple', 'Turista na Própria Cidade', 'Visitem um lugar na cidade de vocês onde nunca foram antes (um parque, uma rua, um monumento).', 'aventura', '🏙️', 90),
('couple', 'Cozinha Surpresa', 'Comprem ingredientes que nunca usaram antes e tentem inventar um prato juntos (ou seguir uma receita exótica).', 'aventura', '🍳', 60),
('couple', 'Acampamento na Sala', 'Montem uma cabana com lençóis e travesseiros na sala. Passem a noite (ou vejam um filme) ali dentro.', 'diversão', '⛺', 120),
('couple', 'O Jogo da Moeda', 'Saiam para caminhar ou dirigir. Em cada esquina, joguem uma moeda: Cara vira à direita, Coroa à esquerda. Vejam onde chegam.', 'aventura', '🪙', 40),
('couple', 'Piquenique Noturno', 'Façam um lanche no chão da varanda ou do quintal à noite, observando o céu.', 'romance', '🌙', 50),
('couple', 'Troca de Hobby', 'Cada um ensina ao outro, por 15 minutos, algo que ama fazer (ex: jogar videogame, maquiagem, xadrez, yoga).', 'aprendizado', '🎮', 30),
('couple', 'Karaokê de Chuveiro', 'Escolham uma playlist de músicas bregas e cantem juntos o mais alto possível durante o banho.', 'diversão', '🎤', 15),
('couple', 'Fotos de Modelo', 'Um veste uma roupa elegante ou engraçada e o outro faz um ensaio fotográfico de 10 minutos. Depois troquem.', 'diversão', '📸', 30),
('couple', 'Teste Cego de Sabor', 'Vendem os olhos do parceiro e deem 3 alimentos diferentes para ele provar e adivinhar o que é.', 'sensorial', '🍓', 20),
('couple', 'Desafio dos R$ 20', 'Vão a uma loja de variedades ou mercado com R$ 20 (ou valor baixo) cada. Comprem um presente surpresa para o outro.', 'diversão', '🎁', 45),

-- Categoria: Planejamento & Sonhos
('couple', 'Quadro dos Sonhos', 'Peguem revistas velhas ou busquem imagens no celular. Montem uma colagem de como querem que a vida seja em 5 anos.', 'sonhos', '🖼️', 60),
('couple', 'Bucket List', 'Listem 5 coisas loucas que querem fazer juntos antes de morrer. Nenhuma ideia é "grande demais".', 'sonhos', '📝', 20),
('couple', 'Orçamento dos Sonhos', 'Se ganhassem 1 milhão hoje, quais seriam as 3 primeiras coisas que fariam? Detalhem o plano.', 'sonhos', '💰', 30),
('couple', 'Cápsula do Tempo', 'Escrevam uma carta para o "Nós" do futuro. Guardem e coloquem um lembrete no celular para abrir em 1 ano.', 'profundo', '⏳', 25),
('couple', 'Planejamento de Viagem', 'Escolham um destino no mapa. Pesquisem passagens e hotéis como se fossem viajar amanhã, mesmo sem marcar data.', 'aventura', '✈️', 40);


-- === PARTE 2: PERGUNTAS PROFUNDAS (Para "Ritual da Semana" ou Conversas) ===
-- Inseridas com categoria 'conversa' para serem filtradas
INSERT INTO activities (type, title, prompt, category, emoji, duration) VALUES
-- Base: Arthur Aron (36 Perguntas) & Vulnerabilidade
('couple', 'Jantar da Verdade', 'Pergunta: Se você pudesse mudar qualquer coisa na forma como foi criado(a), o que seria?', 'conversa', '🍽️', 30),
('couple', 'Superpoderes', 'Pergunta: Se você pudesse acordar amanhã com uma nova qualidade ou habilidade, qual seria?', 'conversa', '🦸', 15),
('couple', 'O Dia Perfeito', 'Pergunta: Descreva em detalhes o que seria um "dia perfeito" para você, do acordar ao dormir.', 'conversa', '☀️', 20),
('couple', 'Linguagem do Amor', 'Pergunta: O que eu faço (ou deixo de fazer) que faz você se sentir mais amado(a)?', 'conversa', '❤️', 25),
('couple', 'Memória Preciosa', 'Pergunta: Qual é a sua memória mais querida de nós dois? Por que essa especificamente?', 'conversa', '🧠', 15),
('couple', 'Medo Secreto', 'Pergunta: Há algo que você sonha em fazer há muito tempo, mas não fez? Por que não?', 'conversa', '😨', 20),
('couple', 'Gratidão Profunda', 'Pergunta: Diga 3 características minhas que você gostaria de ter em si mesmo(a).', 'conversa', '🙏', 10),
('couple', 'A Última Ligação', 'Pergunta: Se você fosse morrer esta noite sem falar com ninguém, o que você se arrependeria de não ter me dito?', 'conversa', '📞', 15),
('couple', 'Choro e Consolo', 'Pergunta: Quando foi a última vez que você chorou? O que eu posso fazer quando você estiver triste?', 'conversa', '😢', 20),
('couple', 'Casa Pegando Fogo', 'Pergunta: Se a casa pegasse fogo e todos estivessem salvos, qual único objeto você salvaria e por quê?', 'conversa', '🔥', 15),

-- Base: Construção de Futuro & Alinhamento
('couple', 'Definição de Sucesso', 'Pergunta: O que significa "ter sucesso na vida" para você? Estamos caminhando para isso?', 'conversa', '🚀', 30),
('couple', 'Filhos e Legado', 'Pergunta: O que você gostaria de fazer diferente dos seus pais na criação da nossa família (ou sobrinhos/pets)?', 'conversa', '👶', 25),
('couple', 'Velhice Juntos', 'Pergunta: Imagine-nos com 80 anos. Onde estamos sentados e sobre o que estamos rindo?', 'conversa', '👴', 15),
('couple', 'Divisão de Tarefas', 'Pergunta: Existe alguma tarefa doméstica ou responsabilidade que está pesando para você hoje?', 'conversa', '⚖️', 20),
('couple', 'Carreira x Vida', 'Pergunta: Você sente que dedicamos tempo suficiente para nós, ou o trabalho está ocupando muito espaço?', 'conversa', '💼', 25),

-- Base: Intimidade & "Spicy" (Leve)
('couple', 'Atração', 'Pergunta: O que eu visto que você acha mais sexy?', 'conversa', '👗', 10),
('couple', 'Melhor Beijo', 'Pergunta: Fora o primeiro, qual foi o melhor beijo que já demos? Onde estávamos?', 'conversa', '💋', 15),
('couple', 'Fantasia', 'Pergunta: Se pudéssemos viajar para qualquer lugar só para namorar, para onde iríamos?', 'conversa', '🏨', 15),
('couple', 'Toque Físico', 'Pergunta: Qual tipo de carinho (cafuné, abraço, mão dada) você sente falta ou gostaria de receber mais?', 'conversa', '💆', 15),
('couple', 'Primeira Impressão', 'Pergunta: O que você pensou exatamente na primeira vez que me viu?', 'conversa', '👀', 20),

-- Base: Autoconhecimento
('couple', 'Desafio Pessoal', 'Pergunta: Qual é o maior desafio que você está enfrentando internamente agora e como posso ajudar?', 'conversa', '🧗', 25),
('couple', 'Orgulho', 'Pergunta: De qual conquista nossa como casal você tem mais orgulho?', 'conversa', '🏆', 15),
('couple', 'Arrependimento', 'Pergunta: Se pudesse apagar um erro do passado, qual seria?', 'conversa', '❌', 20),
('couple', 'Amizade', 'Pergunta: O que significa para você ser meu "melhor amigo" além de namorado/marido?', 'conversa', '🤝', 20),
('couple', 'O "Eu" Real', 'Pergunta: Você sente que pode ser 100% você mesmo comigo? Se não, o que te trava?', 'conversa', '🪞', 30);
