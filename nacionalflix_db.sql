-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 02/12/2025 às 22:07
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `nacionalflix_db`
--
CREATE DATABASE IF NOT EXISTS `nacionalflix_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `nacionalflix_db`;

-- --------------------------------------------------------

--
-- Estrutura para tabela `comentarios`
--

CREATE TABLE `comentarios` (
  `id` int(11) NOT NULL,
  `filme_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `nota` decimal(3,1) DEFAULT NULL,
  `comentario` text DEFAULT NULL,
  `data_comentario` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `comentarios`
--

INSERT INTO `comentarios` (`id`, `filme_id`, `usuario_id`, `nota`, `comentario`, `data_comentario`) VALUES
(3, 22, 1, 5.0, 'Filme maravilhoso!!', '2025-10-06 21:20:57'),
(5, 23, 1, 5.0, 'Teste', '2025-11-30 22:35:02');

-- --------------------------------------------------------

--
-- Estrutura para tabela `filmes`
--

CREATE TABLE `filmes` (
  `id` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `sinopse` text DEFAULT NULL,
  `ano_lancamento` int(11) DEFAULT NULL,
  `duracao_min` int(11) DEFAULT NULL,
  `genero` varchar(255) DEFAULT NULL,
  `diretores` varchar(255) DEFAULT NULL,
  `elenco` text DEFAULT NULL,
  `url_poster` varchar(255) DEFAULT NULL,
  `url_trailer` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `filmes`
--

INSERT INTO `filmes` (`id`, `titulo`, `sinopse`, `ano_lancamento`, `duracao_min`, `genero`, `diretores`, `elenco`, `url_poster`, `url_trailer`) VALUES
(1, 'Tropa de Elite', 'Em Tropa de Elite, o dia-a-dia do grupo de policiais e de um capitão do BOPE (Wagner Moura), que quer deixar a corporação e tenta encontrar um substituto para seu posto. Paralelamente dois amigos de infância se tornam policiais e se destacam pela honestidade e honra ao realizar suas funções, se indignando com a corrupção existente no batalhão em que atuam.<br>Sinopse por: AdoroCinema', 2007, 115, 'Ação, Drama, Policial', 'José Padilha', 'Wagner Moura, Caio Junqueira, André Ramiro', 'img/poster-tropa-de-elite.jpg', 'https://www.youtube.com/embed/i7Nm_RZvvxs?si=84OWI1x3UKs3kr7O'),
(2, 'Cidade de Deus', 'Dadinho (Douglas Silva) e Buscapé são grandes amigos, que cresceram juntos imersos em um universo de muita violência. Na Cidade de Deus, favela carioca conhecida por ser um dos locais mais violentos do Rio de Janeiro, os caminhos das duas crianças divergem, quando um se esforça para se tornar um fotógrafo e o outro o chefe do tráfico. Buscapé (Alexandre Rodrigues) é um jovem pobre, negro e muito sensível, que vive amedrontado com a possibilidade de se tornar um bandido, e acaba sendo salvo de seu destino por causa de seu talento como fotógrafo, o qual permite que siga carreira na profissão. É através de seu olhar atrás da câmera que Buscapé analisa o dia-a-dia da favela onde vive, enquanto Dadinho, agora Zé Pequeno (Leandro Firmino), se torna o temido chefe do tráfico da região, continuando com o legado de violência que remonta a décadas anteriores - e parece ser infinita. Considerado um dos melhores filmes da história do cinema brasileiro.<br>Sinopse por: AdoroCinema', 2002, 130, 'Drama, Policial', 'Fernando Meirelles, Kátia Lund', 'Alexandre Rodrigues, Leandro Firmino, Phellipe Haagensen', 'img/poster-cidade-de-deus.jpg', 'https://www.youtube.com/embed/fZJUKixyeXM?si=pfsgrDUImyE6egeX'),
(3, 'Central do Brasil', 'Em Central do Brasil, Dora (Fernanda Montenegro) trabalha escrevendo cartas para analfabetos na estação Central do Brasil, no centro da cidade do Rio de Janeiro. Ainda que a escrivã não envie todas as cartas que escreve - as cartas que considera inúteis ou fantasiosas demais -, ela decide ajudar um menino (Vinícius de Oliveira), após sua mãe ser atropelada, a tentar encontrar o pai que nunca conheceu, no interior do Nordeste.<br>Sinopse por: AdoroCinema', 1998, 113, 'Drama', 'Walter Salles', 'Fernanda Montenegro, Vinícius de Oliveira, Marília Pêra', 'img/poster-central-do-brasil.jpg', 'https://www.youtube.com/embed/lARFBFxjLNI?si=TFP97OXbh7f7QG0d'),
(4, 'O Auto da Compadecida', 'As aventuras dos nordestinos João Grilo (Matheus Natchergaele), um sertanejo pobre e mentiroso, e Chicó (Selton Mello), o mais covarde dos homens. Ambos lutam pelo pão de cada dia e atravessam por vários episódios enganando a todos do pequeno vilarejo de Taperoá, no sertão da Paraíba. A salvação da dupla acontece com a aparição da Nossa Senhora (Fernanda Montenegro). Adaptação da obra de Ariano Suassuna.<br>Sinopse por: AdoroCinema', 2000, 104, 'Comédia, Aventura, Drama', 'Guel Arraes', 'Matheus Nachtergaele, Selton Mello, Denise Fraga', 'img/poster-auto-da-compadecida.jpg', 'https://www.youtube.com/embed/ewaz-WuKdo8?si=cjABuyiNG5uKYGyb'),
(5, 'Ainda Estou Aqui', 'Ainda Estou Aqui é uma adaptação cinematográfica do livro autobiográfico de Marcelo Rubens Paiva, que narra a emocionante trajetória de sua mãe, Eunice Paiva, durante a ditadura militar no Brasil. Ambientada em 1970, a história retrata como a vida de uma mulher casada com um importante político muda drasticamente após o desaparecimento dele, capturado pelo regime militar. Forçada a abandonar a rotina de dona de casa, Eunice (Fernanda Torres/Fernanda Montenegro) se transforma em uma ativista dos direitos humanos, lutando pela verdade sobre o paradeiro do marido e enfrentando as consequências brutais da repressão. O filme explora não apenas o drama pessoal de Eunice, mas também o impacto do regime militar na vida de milhares de famílias brasileiras, destacando o papel das mulheres na resistência. Com uma narrativa profunda e sensível, Ainda Estou Aqui traz à tona questões de perda, coragem e resiliência, enquanto revisita um dos períodos mais sombrios da história do Brasil. A obra é um tributo à força de Eunice Paiva, que, contra todas as adversidades, se torna uma figura central na luta pelos direitos humanos no país.<BR>Sinopse por: AdoroCinema', 2024, 135, 'Drama, Suspense', 'Walter Salles', 'Fernanda Torres, Fernanda Montenegro, Selton Mello', 'img/poster-ainda-estou-aqui.jpg', 'https://www.youtube.com/embed/_NzqP0jmk3o?si=iUlsAzVJvvH476ZF'),
(6, 'Bingo - O Rei das Manhãs', 'Cinebiografia de Arlindo Barreto, um dos intérpretes do palhaço Bozo no programa matinal homônimo exibido pelo SBT durante a década de 1980. Barreto alcançou a fama graças ao personagem, apesar de jamais ser reconhecido pelas pessoas por sempre estar fantasiado. Esta frustração o levou a se envolver com drogas, chegando a utilizar cocaína e crack nos bastidores do programa.<br>Sinopse por: AdoroCinema', 2017, 113, 'Cinebiografia, Comédia, Drama', 'Daniel Rezende', 'Vladimir Brichta, Leandra Leal, Augusto Madeira', 'img/poster-bingo.jpg', 'https://www.youtube.com/embed/4xHP9tiS6NM?si=vl4CF237ZB5_47_Q'),
(7, 'Chico Bento e a Goiabeira Maraviósa', 'Um dos personagens mais queridos do universo de A Turma da Mônica irá enfrentar um grande desafio em Chico Bento e a Goiabeira Maraviósa. Chico Bento acorda para mais um dia na Vila Abobrinha focado em conseguir subir em sua amada goiabeira para pegar a fruta sem o dono das terras saber. O que Chico não esperava era que sua preciosa árvore estaria ameaçada pela construção de uma estrada na região, já que, para desenhar a rodovia, será preciso pavimentá-la pela propriedade de Nhô Lau, exatamente onde a goiabeira está plantada. Focado em salvar a árvore, Chico Bento reúne seus amigos Zé Lelé, Rosinha, Zé da Roça, Tábata, Hiro e toda a comunidade para acabar com o projeto da família de Genezinho e Dotô Agripino. Com a turminha se metendo em diversas confusões, Chico Bento e a Goiabeira Maraviósa traz uma aventura que irá tirar o sossego e a tranquilidade da Vila Abobrinha.<br>Sinopse por: AdoroCinema', 2025, 90, 'Aventura, Comédia', 'Fernando Fraiha', 'Isaac Amendoim, Pedro Dantas, Anna Julia Dias', 'img/poster-chico-bento-goiabeira-maraviosa.jpg', 'https://www.youtube.com/embed/7M0fKoXuQxc?si=9EW-xdKofr3jG7u4'),
(8, 'Gonzaga - De Pai pra Filho', 'Decidido a mudar seu destino, Gonzaga sai de casa jovem e segue para cidade grande em busca de novos horizontes e para apagar uma tristeza amorosa. Lá, ele conhece uma bela mulher, Odaléia (Nanda Costa), por quem se encanta. Após o nascimento do filho e complicações de saúde da esposa, ele decide voltar para a estrada para garantir os estudos e um futuro melhor para o herdeiro. Para isso, deixa o pequeno aos cuidados de amigos no Rio de Janeiro e sai pelo Brasil afora. Só não imaginava que essa distância entre eles faria crescer uma complicada relação, potencializada pelas personalidades fortes de ambos. Baseada em conversas realizadas entre pai e filho, essa é a história do cantor e sanfoneiro Luiz Gonzaga, também conhecido como O Rei do Baião ou Gonzagão, e de seu filho, popularmente chamado de Gonzaguinha.<br>Sinopse por: AdoroCinema', 2012, 120, 'Drama', 'Breno Silveira', 'Nivaldo Expedito de Carvalho, Júlio Andrade, Nanda Costa', 'img/poster-gonzaga-de-pai-para-filho.jpg', 'https://www.youtube.com/embed/63Na62E0LZk?si=GJ3U8uEXa01-Rwr7'),
(9, 'Irmã Dulce', 'Cinebiografia de Irmã Dulce (Bianca Comparato/Regina Braga), que, em vida, foi chamada de “Anjo Bom da Bahia”, também indicada ao Nobel da Paz e beatificada pela Igreja. Contemplando da década de 1940 aos anos 1980, o filme mostra como a religiosa católica enfrentou uma doença respiratória incurável, o machismo, a indiferença de políticos e até mesmo os dogmas da Igreja para dedicar sua vida ao cuidado dos miseráveis – personificados na figura do fictício João (Amaurih Oliveira) –, deixando um legado que perdura até hoje.<br>Sinopse por: AdoroCinema', 2014, 90, 'Cinebiografia, Drama', 'Vicente Amorim', 'Bianca Comparato, Regina Braga, Glória Pires', 'img/poster-irma-dulce.jpg', 'https://www.youtube.com/embed/iU97ncEwBVk?si=XHzsTJVnHu2T0qbl'),
(10, 'Minha Mãe é Uma Peça 2', 'Em Minha Mãe é uma Peça 2, Dona Hermínia (Paulo Gustavo) está de volta! Desta vez ela está rica, pois passou a apresentar um bem-sucedido programa de TV. Porém, a mãe superprotetora vai ter que lidar com o ninho vazio, afinal Juliano (Rodrigo Pandolfo) e Marcelina (Mariana Xavier) resolvem criar asas e sair de casa. Para balancear, Garib (Bruno Bebianno), o primogênito, chega com o neto. E ela também vai receber uma longa visitinha da irmã Lucia Helena (Patricya Travassos), a ovelha negra da família, que mora há anos em Nova York.<br>Sinopse por: AdoroCinema', 2016, 96, 'Comédia', 'César Rodrigues', 'Paulo Gustavo, Rodrigo Pandolfo, Mariana Xavier', 'img/poster-minha-mae-e-uma-peca-2.jpg', 'https://www.youtube.com/embed/9hyLbCV0Dxo?si=0jOa1jfh6rGc2z8z'),
(11, 'Minha Mãe é Uma Peça 3', 'Em Minha Mãe É Uma Peça 3, Dona Hermínia (Paulo Gustavo) vai ter que se redescobrir e se reinventar porque seus filhos estão formando novas famílias. Essa supermãe vai ter que segurar a emoção para lidar com um novo cenário de vida: Marcelina (Mariana Xavier) está grávida e Juliano (Rodrigo Pandolfo) vai casar. Dona Hermínia está mais ansiosa do que nunca! Para completar as confusões, Carlos Alberto (Herson Capri), seu ex-marido, que esteve sempre por perto, agora resolve se mudar para o apartamento ao lado.<br>Sinopse por: AdoroCinema', 2019, 105, 'Comédia', 'Susana Garcia', 'Paulo Gustavo, Rodrigo Pandolfo, Mariana Xavier', 'img/poster-minha-mae-e-uma-peca-3.jpg', 'https://www.youtube.com/embed/vQs31hCrUU8?si=6JQL-BRBusm-e1JZ'),
(12, 'Minha Mãe é Uma Peça', 'Dona Hermínia (Paulo Gustavo) é uma mulher de meia idade, divorciada do marido (Herson Capri), que a trocou por uma mais jovem (Ingrid Guimarães). Hiperativa, ela não larga o pé de seus filhos Marcelina (Mariana Xavier) e Juliano (Rodrigo Pandolfo), sem se dar conta que eles já estão bem grandinhos. Um dia, após descobrir que eles consideram ela uma chata, resolve sair de casa sem avisar para ninguém, deixando todos, de alguma forma, preocupados com o que teria acontecido. Mal sabem eles que a mãe foi visitar a querida tia Zélia (Sueli Franco) para desabafar com ela suas tristezas do presente e recordar os bons tempos do passado.<br>Sinopse por: AdoroCinema', 2013, 85, 'Comédia', 'André Pellenz', 'Paulo Gustavo, Ingrid Guimarães, Herson Capri', 'img/poster-minha-mae-e-uma-peca.jpg', 'https://www.youtube.com/embed/mmxpIRKfYZM?si=_O5j4AOZJbuQ8qrX'),
(13, 'O Homem do Futuro', 'João/Zero (Wagner Moura) é um cientista genial, mas infeliz porque há 20 anos foi humilhado publicamente durante uma festa e perdeu Helena (Alinne Moraes), uma antiga e eterna paixão. Certo dia, uma experiência com um de seus inventos permite que ele faça uma viagem no tempo, retornando para aquela época e podendo interferir no seu destino. Mas quando ele retorna, descobre que sua vida mudou totalmente e agora precisa encontrar um jeito de mudar essa história, nem que para isso tenha que voltar novamente ao passado. Será que ele conseguirá acertar as coisas?<br>Sinopse por: AdoroCinema', 2011, 106, 'Comédia, Fantasia, Romance', 'Cláudio Torres', 'Wagner Moura, Alinne Moraes, Maria Luisa Mendonça', 'img/poster-o-homem-do-futuro.jpg', 'https://www.youtube.com/embed/MF9yacevSvs?si=bld8SMdq0DyVPQsW'),
(14, 'O Lobo Atrás da Porta', 'O desaparecimento de uma criança faz com que seus pais, Bernardo (Milhem Cortaz) e Sylvia (Fabiula Nascimento), vão até uma delegacia. O caso fica a cargo do delegado (Juliano Cazarré), que resolve interrogá-los separadamente. Logo descobre que Bernardo mantinha uma amante, Rosa (Leandra Leal), que é levada à delegacia para averiguações. A partir de depoimentos do trio, o delegado descobre uma rede de mentiras, amor, vingança e ciúmes envolvendo o trio.<br>Sinopse por: AdoroCinema', 2014, 101, 'Drama, Policial, Suspense', 'Fernando Coimbra', 'Leandra Leal, Milhem Cortaz, Fabiula Nascimento', 'img/poster-o-lobo-atras-da-porta.jpg', 'https://www.youtube.com/embed/fmcmZetihgo?si=WKq8HIOlzuyCV2_g'),
(15, 'O Menino e o Mundo', 'Em O menino e o mundo, um garoto mora com o pai e a mãe, em uma pequena casa no campo. Diante da falta de trabalho, no entanto, o pai abandona o lar e parte para a cidade grande. Triste e desnorteado, o menino faz as malas, pega o trem e vai descobrir o novo mundo em que seu pai mora. Para a sua surpresa, a criança encontra uma sociedade marcada pela pobreza, exploração de trabalhadores e falta de perspectivas. <br>Sinopse por: AdoroCinema', 2014, 85, 'Animação', 'Alê Abreu', 'Patricia Pichamone, Emicida, Vinicius Garcia', 'img/poster-o-menino-e-o-mundo.jpg', 'https://www.youtube.com/embed/Th0NihA2q-Q?si=pDvVxscBDCwLz6nx'),
(16, 'Serra Pelada', 'Juliano (Juliano Cazarré) e Joaquim (Júlio Andrade) são grandes amigos que ficam empolgados ao tomar conhecimento de Serra Pelada, o maior garimpo a céu aberto do mundo, localizado no estado do Pará. A dupla resolve deixar São Paulo e partir para o local, sonhando com a riqueza. Só que, pouco após chegarem, tudo muda na vida deles: Juliano se torna um gângster, enquanto que Joaquim deixa para trás os valores que sempre prezou.<br>Sinopse por: AdoroCinema', 2013, 120, 'Drama', 'Heitor Dhalia', 'Juliano Cazarré, Júlio Andrade, Sophie Charlotte', 'img/poster-serra-pelada.jpg', 'https://www.youtube.com/embed/COXDie8fMSk?si=V6qa7WGoPwPsmLi3'),
(17, 'Trash - A Esperança Vem do Lixo', 'Rio de Janeiro, Brasil. Gardo (Eduardo Luís) e Raphael (Rickson Tevez) são garotos que vivem em um lixão e sempre buscam algo valioso entre os restos despejados no local todo dia. Um dia, Raphael encontra uma carteira com uma boa quantia em dinheiro e a divide com o amigo. Entretanto, logo surge o policial Frederico (Selton Mello), que está justamente procurando a tal carteira a mando de um candidato a prefeito, Santos (Stepan Nercessian). Os garotos não revelam que a encontraram e pedem ajuda a Rato (Gabriel Weinstein), também morador do lixão, para que possam descobrir o que ela tem de tão importante. É quando percebem que, através de uma chave, embarcarão em uma verdadeira caça ao tesouro.<br>Sinopse por: AdoroCinema', 2014, 116, 'Aventura, Comédia, Drama', 'Stephen Daldry, Christian Duurvoort', 'Rickson Tevez, Eduardo Luis, Gabriel Weinstein', 'img/poster-trash-a-esperanca-vem-do-lixo.jpg', 'https://www.youtube.com/embed/MqK0QhthLYM?si=PDHWUkC45yP0C2D8'),
(18, 'Tim Maia', 'Cinebiografia do cantor Tim Maia, baseada no livro \"Vale Tudo - O Som e a Fúria de Tim Maia\". O filme percorre cinquenta anos na vida do artista, desde a sua infância no Rio de Janeiro até a sua morte, aos 55 anos de idade, incluindo a passagem pelos Estados Unidos, onde o cantor descobre novos estilos musicais e é preso por roubo e posse de drogas.<br>Sinopse por: AdoroCinema', 2014, 140, 'Cinebiografia, Drama', 'Mauro Lima', 'Babu Santana, Robson Nunes, Alinne Moraes', 'img/poster-tim-maia.jpg', 'https://www.youtube.com/embed/YKc7mnOzjFA?si=oxzvNK2Sn7B98DJx'),
(19, 'Tropa de Elite 2', 'Nascimento (Wagner Moura), agora coronel, foi afastado do BOPE por conta de uma mal sucedida operação. Desta forma, ele vai parar na inteligência da Secretaria de Segurança Pública do Estado. Contudo, ele descobre que o sistema que tanto combate é mais podre do que imagina e que o buraco é bem mais embaixo. Seus problemas só aumentam, porque o filho, Rafael (Pedro Van Held), tornou-se adolescente, Rosane (Maria Ribeiro) não é mais sua esposa e seu arqui-inimigo, Fraga (Irandhir Santos), ocupa posição de destaque no seio de sua família.<br>Sinopse por: AdoroCinema', 2010, 115, 'Ação, Drama, Policial, Suspense', 'José Padilha', 'Wagner Moura, André Ramiro, Milhem Cortaz', 'img/poster-tropa-de-elite-2.jpg', 'https://www.youtube.com/embed/O8YrtINB5oI?si=r6Fk39pjiT2p9md8'),
(22, 'Vitória', 'Vitória (Fernanda Montenegro) é uma senhora solitária que, aflita com a violência que passa a tomar conta da sua vizinhança e em conflito com os vizinhos, começa a filmar da janela de seu apartamento. A idosa registra a movimentação de traficantes de drogas da região durante meses, com a intenção de cooperar com o trabalho da polícia. A atitude consegue chamar a atenção de um jornalista, que faz amizade com Vitória e tenta ajudá-la nessa missão.<br>Sinopse por: AdoroCinema', 2025, 112, 'Drama, Policial', 'Andrucha Waddington', 'Fernanda Montenegro, Silvio Guindane, Jeniffer Dias', 'img/poster-vitoria.jpg', 'https://www.youtube.com/embed/3Zr6YJ02r5g?si=1bjbadbB6iJGGvD9'),
(23, 'Era Uma Vez...', 'Rio de Janeiro. Dé (Thiago Martins) mora na favela do Cantagalo, em Ipanema. Filho da empregada doméstica Bernadete (Cyria Coentro) e abandonado pelo pai, Dé viu seu irmão Beto ser assassinado por um traficante e seu outro irmão, Carlão (Rocco Pitanga), ser exilado da favela pelos bandidos. Decidido a não seguir o caminho do crime, Dé trabalha vendendo cachorro-quente num quiosque da praia. De lá ele observa Nina (Vitória Frate), filha única de uma família rica que mora na Vieira Souto, avenida em frente à praia. Os dois se conhecem e acabam se apaixonando, porém as diferenças entre seus mundos geram diversas críticas e preconceitos velados. <br> Sinopse por: Adoro Cinema', 2008, 116, 'Drama', 'Breno Silveira', 'Thiago Martins, Vitória Frate, Rocco Pitanga\n', 'img/poster-euv.jpg', 'https://www.youtube.com/embed/eTkXfNt3O2k?si=gTXAGfhWTDFBzPSj'),
(24, 'Nise - O Coração da Loucura', 'Ao voltar a trabalhar em um hospital psiquiátrico no subúrbio do Rio de Janeiro, após sair da prisão, a doutora Nise da Silveira (Gloria Pires) propõe uma nova forma de tratamento aos pacientes que sofrem da esquizofrenia, eliminando o eletrochoque e lobotomia. Seus colegas de trabalho discordam do seu meio de tratamento e a isolam, restando a ela assumir o abandonado Setor de Terapia Ocupacional, onde dá início a uma nova forma de lidar com os pacientes, através do amor e da arte.<br> Sinopse por: Adoro Cinema', 2016, 108, 'Biografia, Drama', 'Roberto Berliner', 'Glória Pires, Luciana Fregolente, Simone Mazzer', 'img/poster-nise.jpg', 'https://www.youtube.com/embed/akGY2w9blSs?si=HAvcOBtecX36XkcE'),
(25, 'Meu Pé de Laranja Lima', 'Zezé (João Guilherme de Ávila) é um garoto de oito anos que, apesar de levado, tem um bom coração. Ele leva uma vida bem modesta, devido ao fato de que seu pai está desempregado há bastante tempo, e tem o costume de ter longas conversas com um pé de laranja lima que fica no quintal de sua casa. Até que, um dia, conhece Portuga (José de Abreu), um senhor que passa a ajudá-lo e logo se torna seu melhor amigo.<br> Sinopse por: Adoro Cinema', 2013, 99, 'Drama', 'Marcos Bernstein', 'João Guilherme Ávila, José de Abreu, Caco Ciocler', 'img/poster-mpdll.jpg', 'https://www.youtube.com/embed/I16k7dShf0U?si=ZFcfJpopeBzxhua-'),
(26, '2 Coelhos', 'Após se envolver em um grave acidente automobilístico, no qual uma mulher e seu filho são mortos, Edgar (Fernando Alves Pinto) é indiciado, mas consegue escapar da prisão graças à influência de um deputado estadual. Logo em seguida ele parte para uma temporada em Miami, onde retorna com um elaborado plano em que pretende atingir tanto o deputado que o ajudou, símbolo da corrupção política, quanto Maicon (Marat Descartes), um criminoso que consegue escapar da justiça graças ao suborno de políticos influentes.<br>Sinopse por: Adoro Cinema', 2012, 108, 'Ação, Suspense', 'Afonso Poyart', 'Fernando Alves Pinto, Caco Ciocler, Alessandra Negrini', 'img/poster-2coelhos.jpg', 'https://www.youtube.com/embed/vB0CG6LvuiU?si=3U11Y_fygcm3cfq3'),
(27, 'O Tempo e o Vento', 'Rio Grande do Sul, final do século XIX. As família Amaral e Terra-Cambará são inimigas históricas na cidade de Santa Fé. Quando o sobrado dos Terra-Cambará é cercado pelos Amaral, todos os integrantes da família são obrigados a defender o local com as armas que têm à disposição. Esta vigília dura vários dias, o que faz com que logo a comida escasseie. Entre eles está Bibiana (Fernanda Montenegro), matriarca da família que recebe a visita de seu falecido esposo, o capitão Rodrigo (Thiago Lacerda). Juntos eles relembram a história não apenas de seu amor, mas de como nasceu a própria família Terra-Cambará.<br>Sinopse por: Adoro Cinema', 2013, 127, 'Drama', 'Jayme Monjardim', 'Thiago Lacerda, Marjorie Estiano, Fernanda Montenegro', 'img/poster-oteov.jpg', 'https://www.youtube.com/embed/1vsGqt2W_XU?si=uhIMHFXqxBrLJd3v'),
(28, 'Última Parada - 174', 'Rio de Janeiro, 1983. Marisa (Cris Vianna) amamenta o pequeno Alessandro (Marcello Melo Jr.), em sua casa na favela. Viciada em drogas, assiste impotente seu filho ser retirado de suas mãos pelo chefe do tráfico local, devido à uma dívida não paga. Dez anos depois Sandro (Michel Gomes), filho único, vê sua mãe ser morta por dois ladrões. Apesar de ficar sob os cuidados da tia, ele decide fugir e passa a conviver com um grupo de garotos que dorme na igreja da Candelária, onde tem acesso ao mundo das drogas. Apesar de não saber ler ou escrever, Sandro sonha em ser um famoso compositor de rap. Para tanto ele espera a ajuda de Walquíria (Anna Cotrim), que realiza um trabalho voluntário junto a meninos de rua. Só que Sandro testemunha mais uma tragédia, a chacina da Candelária, onde 8 meninos de rua foram mortos pela polícia. Este evento aproxima Sandro e Alessandro, que passam a ter um forte convívio.<br>Sinopse por: Adoro Cinema', 2008, 108, 'Drama, Suspense', 'Bruno Barreto', 'Silvio Orlando, Michel Gomes, Chris Vianna', 'img/poster-up174.jpg', 'https://www.youtube.com/embed/0dC1uxtgneE?si=g0T2IKXvk1Ft4Exm'),
(29, 'Cidade dos Homens', 'Laranjinha (Darlan Cunha) e Acerola (Douglas Silva) são amigos, que cresceram juntos em uma favela do Rio de Janeiro e agora estão com 18 anos. Acerola tem um filho de 2 anos para cuidar, mas sente-se preso pelo casamento e lamenta a paternidade precoce. Já Laranjinha está decidido a encontrar seu próprio pai, que não conhece. Paralelamente o morro em que vivem é sacudido pelo mundo do tráfico, já que Madrugadão (Jonathan Haagensen), primo de Laranjinha, perdeu o posto de dono do local para Nefasto (Eduardo BR).<br>Sinopse por: Adoro Cinema', 2007, 110, 'Ação, Drama', 'Paulo Morelli', 'Douglas Silva, Darlan Cunha, Jonathan Haagensen', 'img/poster-cdh.jpg', 'https://www.youtube.com/embed/M6FabnIndBU?si=FP7hJVPBpzDkCChZ'),
(30, 'Somos Tão Jovens', 'Somos Tão Jovens se passa em Brasília, 1973 e acompanha Renato (Thiago Mendonça), que acabou de se mudar com a família para a cidade, vindo do Rio de Janeiro. Na época ele sofria de uma doença óssea rara, a epifisiólise, que o deixou numa cadeira de rodas após passar por uma cirurgia. Obrigado a permanecer em casa, aos poucos ele passou a se interessar por música. Fã do punk rock, Renato começa a se envolver com o cenário musical de Brasília após melhorar dos problemas de saúde. É quando ajuda a fundar a banda Aborto Elétrico e, posteriormente, a Legião Urbana.<br>Sinopse por Adoro Cinema', 2013, 104, 'Biografia, Drama', 'Antonio Carlos da Fontoura', 'Thiago Mendonça, Laila Zaid, Bruno Torres', 'img/poster-stj.jpg', 'https://www.youtube.com/embed/ahnSbVe-_sY?si=nf9fq_MjPlu2Hjyn'),
(31, 'Eduardo e Mônica', 'Em um dia atípico, situado em Brasília na década de 1980, uma série de coincidências leva Eduardo (Gabriel Leone) a conhecer Mônica (Alice Braga), tendo como pano de fundo uma festa estranha com gente esquisita. Uma curiosidade é despertada nos dois e, apesar de não serem parecidos, eles se apaixonam perdidamente. Ambos são completamente diferentes. Além da discrepância de idade entre os dois, signos diferentes e cores de cabelo diferentes, eles também têm gostos que, aos olhos de outras pessoas, são incompatíveis. Parece que o amor entre os dois nunca passará apenas de alguns meses. Depois de começarem um namoro, esse amor precisará amadurecer e aprender a superar as diferenças. Eduardo e Mônica terão também que superar o preconceito de outros que tentarão acabar com o relacionamento. Mas é aquilo: \"Quem um dia irá dizer que não existe razão nas coisas feitas pelo coração\". A comédia romântica é baseada na música homônima de Renato Russo, da banda Legião, Urbana.<br>Sinopse por Adoro Cinema', 2022, 114, 'Comédia, Drama, Romance', 'René Sampaio', 'Gabriel Leone, Alice Braga, Victor Lamoglia', 'img/poster-eem.jpg', 'https://www.youtube.com/embed/IoSR5tl1AAU?si=EkjMW4WbLgtYD_Vm'),
(32, 'Uma História de Amor e Fúria', 'Um homem (Selton Mello) com quase 600 anos de idade acompanha a história do Brasil, enquanto procura a ressurreição de sua amada Janaína (Camila Pitanga). Ele enfrenta as batalhas entre tupinambás e tupiniquins, antes dos portugueses chegarem ao país, e passa pela Balaiada e o movimento de resistência contra a ditadura militar, antes de enfrentar a guerra pela água em 2096.<br>Sinopse por Adoro Cinema', 2013, 115, 'Animação, Drama', 'Luiz Bolognesi, Jean de Moura', 'Selton Mello, Camila Pitanga, Rodrigo Santoro', 'img/poster-uhdaef.jpg', 'https://www.youtube.com/embed/_a28iEb6raU?si=ELcW-tHbnzCRg6FA');

-- --------------------------------------------------------

--
-- Estrutura para tabela `filme_plataformas`
--

CREATE TABLE `filme_plataformas` (
  `id` int(11) NOT NULL,
  `filme_id` int(11) NOT NULL,
  `plataforma_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `filme_plataformas`
--

INSERT INTO `filme_plataformas` (`id`, `filme_id`, `plataforma_id`) VALUES
(1, 1, 1),
(12, 1, 2),
(9, 1, 5),
(4, 2, 3),
(3, 2, 5),
(8, 2, 8),
(13, 3, 1),
(5, 3, 3),
(7, 4, 2),
(6, 4, 3),
(14, 5, 3),
(16, 6, 2),
(15, 6, 4),
(18, 7, 2),
(19, 9, 1),
(21, 10, 1),
(20, 10, 3),
(24, 11, 2),
(23, 11, 3),
(27, 12, 1),
(28, 12, 2),
(26, 12, 3),
(31, 13, 2),
(29, 13, 4),
(30, 13, 8),
(33, 14, 2),
(32, 14, 4),
(35, 15, 2),
(36, 16, 4),
(38, 17, 2),
(37, 17, 4),
(40, 18, 2),
(41, 18, 7),
(43, 19, 3),
(44, 19, 7),
(47, 22, 2),
(46, 22, 3),
(48, 23, 2),
(49, 24, 2),
(50, 25, 2),
(51, 26, 1),
(52, 26, 2),
(53, 26, 7),
(54, 27, 1),
(56, 28, 2),
(55, 28, 8),
(57, 29, 1),
(58, 30, 1),
(59, 31, 3),
(60, 31, 7);

-- --------------------------------------------------------

--
-- Estrutura para tabela `historico_assistidos`
--

CREATE TABLE `historico_assistidos` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `filme_id` int(11) NOT NULL,
  `data_marcado` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `historico_assistidos`
--

INSERT INTO `historico_assistidos` (`id`, `usuario_id`, `filme_id`, `data_marcado`) VALUES
(12, 1, 5, '2025-10-21 21:50:36'),
(13, 1, 9, '2025-10-21 21:50:40');

-- --------------------------------------------------------

--
-- Estrutura para tabela `imagens_filme`
--

CREATE TABLE `imagens_filme` (
  `id` int(11) NOT NULL,
  `filme_id` int(11) NOT NULL,
  `url_imagem` varchar(255) NOT NULL,
  `descricao` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `imagens_filme`
--

INSERT INTO `imagens_filme` (`id`, `filme_id`, `url_imagem`, `descricao`) VALUES
(1, 2, 'img/cdd-galeria1.jpg', NULL),
(2, 2, 'img/cdd-galeria2.jpg', NULL),
(3, 2, 'img/cdd-galeria3.jpg', NULL),
(4, 2, 'img/cdd-galeria4.jpg', NULL),
(5, 2, 'img/cdd-galeria5.jpg', NULL),
(6, 1, 'img/tropa1-galeria1.jpg', NULL),
(7, 1, 'img/tropa1-galeria2.jpg', NULL),
(8, 1, 'img/tropa1-galeria3.jpg', NULL),
(9, 1, 'img/tropa1-galeria4.jpg', NULL),
(10, 1, 'img/tropa1-galeria5.jpg', NULL),
(11, 1, 'img/tropa1-galeria6.jpg', NULL),
(12, 3, 'img/cdb-galeria1.jpg', NULL),
(13, 3, 'img/cdb-galeria2.jpg', NULL),
(14, 3, 'img/cdb-galeria3.jpg', NULL),
(15, 3, 'img/cdb-galeria4.jpg', NULL),
(16, 3, 'img/cdb-galeria5.jpg', NULL),
(17, 3, 'img/cdb-galeria6.jpg', NULL),
(18, 4, 'img/adc-galeria1.jpg', NULL),
(19, 4, 'img/adc-galeria2.jpg', NULL),
(20, 4, 'img/adc-galeria3.jpg', NULL),
(21, 4, 'img/adc-galeria4.jpg', NULL),
(22, 4, 'img/adc-galeria5.jpg', NULL),
(23, 4, 'img/adc-galeria6.jpg', NULL),
(24, 5, 'img/aeaq-galeria1.jpg', NULL),
(25, 5, 'img/aeaq-galeria2.jpg', NULL),
(26, 5, 'img/aeaq-galeria3.jpg', NULL),
(27, 5, 'img/aeaq-galeria4.jpg', NULL),
(28, 5, 'img/aeaq-galeria5.jpg', NULL),
(29, 5, 'img/aeaq-galeria6.jpg', NULL),
(30, 6, 'img/bordm-galeria1.jpg', NULL),
(31, 6, 'img/bordm-galeria2.jpg', NULL),
(32, 6, 'img/bordm-galeria3.jpg', NULL),
(33, 6, 'img/bordm-galeria4.jpg', NULL),
(34, 6, 'img/bordm-galeria5.jpg', NULL),
(35, 6, 'img/bordm-galeria6.jpg', NULL),
(36, 6, 'img/bordm-galeria7.jpg', NULL),
(37, 6, 'img/bordm-galeria8.jpg', NULL),
(38, 7, 'img/cbeagm-galeria1.png', NULL),
(39, 7, 'img/cbeagm-galeria2.jpg', NULL),
(40, 7, 'img/cbeagm-galeria3.png', NULL),
(41, 7, 'img/cbeagm-galeria4.png', NULL),
(42, 7, 'img/cbeagm-galeria5.png', NULL),
(43, 7, 'img/cbeagm-galeria6.png', NULL),
(44, 8, 'img/gdppf-galeria1.jpg', NULL),
(45, 8, 'img/gdppf-galeria2.jpg', NULL),
(46, 8, 'img/gdppf-galeria3.jpg', NULL),
(47, 8, 'img/gdppf-galeria4.jpg', NULL),
(48, 8, 'img/gdppf-galeria5.jpg', NULL),
(49, 8, 'img/gdppf-galeria6.jpg', NULL),
(50, 9, 'img/irma-dulce-galeria1.jpg', NULL),
(51, 9, 'img/irma-dulce-galeria2.jpg', NULL),
(52, 9, 'img/irma-dulce-galeria3.jpg', NULL),
(53, 9, 'img/irma-dulce-galeria4.jpg', NULL),
(54, 9, 'img/irma-dulce-galeria5.jpg', NULL),
(55, 9, 'img/irma-dulce-galeria6.jpg', NULL),
(56, 9, 'img/irma-dulce-galeria7.jpg', NULL),
(57, 10, 'img/mmeup2-galeria1.jpg', NULL),
(58, 10, 'img/mmeup2-galeria2.jpg', NULL),
(59, 10, 'img/mmeup2-galeria3.jpg', NULL),
(60, 10, 'img/mmeup2-galeria4.jpg', NULL),
(61, 10, 'img/mmeup2-galeria5.jpg', NULL),
(62, 10, 'img/mmeup2-galeria6.jpg', NULL),
(63, 10, 'img/mmeup2-galeria7.jpg', NULL),
(64, 11, 'img/mmeup3-galeria1.jpg', NULL),
(65, 11, 'img/mmeup3-galeria2.jpg', NULL),
(66, 11, 'img/mmeup3-galeria3.jpg', NULL),
(67, 11, 'img/mmeup3-galeria4.jpg', NULL),
(68, 11, 'img/mmeup3-galeria5.jpg', NULL),
(69, 11, 'img/mmeup3-galeria6.jpg', NULL),
(70, 11, 'img/mmeup3-galeria7.jpg', NULL),
(71, 12, 'img/mmeup-galeria1.jpg', NULL),
(72, 12, 'img/mmeup-galeria2.jpg', NULL),
(73, 12, 'img/mmeup-galeria3.jpg', NULL),
(74, 12, 'img/mmeup-galeria4.jpg', NULL),
(75, 12, 'img/mmeup-galeria5.jpg', NULL),
(76, 12, 'img/mmeup-galeria6.jpg', NULL),
(77, 13, 'img/ohdf-galeria1.jpg', NULL),
(78, 13, 'img/ohdf-galeria2.jpg', NULL),
(79, 13, 'img/ohdf-galeria3.jpg', NULL),
(80, 13, 'img/ohdf-galeria4.jpg', NULL),
(81, 13, 'img/ohdf-galeria5.jpg', NULL),
(82, 13, 'img/ohdf-galeria6.jpg', NULL),
(83, 13, 'img/ohdf-galeria7.jpg', NULL),
(84, 13, 'img/ohdf-galeria8.jpg', NULL),
(85, 14, 'img/oladp-galeria1.jpg', NULL),
(86, 14, 'img/oladp-galeria2.jpg', NULL),
(87, 14, 'img/oladp-galeria3.jpg', NULL),
(88, 14, 'img/oladp-galeria4.jpg', NULL),
(89, 14, 'img/oladp-galeria5.jpg', NULL),
(90, 14, 'img/oladp-galeria6.jpg', NULL),
(91, 14, 'img/oladp-galeria7.jpg', NULL),
(92, 15, 'img/omeom-galeria1.jpg', NULL),
(93, 15, 'img/omeom-galeria2.jpg', NULL),
(94, 15, 'img/omeom-galeria3.jpg', NULL),
(95, 15, 'img/omeom-galeria4.jpg', NULL),
(96, 15, 'img/omeom-galeria5.jpg', NULL),
(97, 15, 'img/omeom-galeria6.jpg', NULL),
(98, 15, 'img/omeom-galeria7.jpg', NULL),
(99, 16, 'img/sp-galeria1.jpg', NULL),
(100, 16, 'img/sp-galeria2.jpg', NULL),
(101, 16, 'img/sp-galeria3.jpg', NULL),
(102, 16, 'img/sp-galeria4.jpg', NULL),
(103, 16, 'img/sp-galeria5.jpg', NULL),
(104, 16, 'img/sp-galeria6.jpg', NULL),
(105, 16, 'img/sp-galeria7.jpg', NULL),
(106, 16, 'img/sp-galeria8.jpg', NULL),
(107, 16, 'img/sp-galeria9.jpg', NULL),
(108, 17, 'img/taevdl-galeria1.jpg', NULL),
(109, 17, 'img/taevdl-galeria2.jpg', NULL),
(110, 17, 'img/taevdl-galeria3.jpg', NULL),
(111, 17, 'img/taevdl-galeria4.jpg', NULL),
(112, 17, 'img/taevdl-galeria5.jpg', NULL),
(113, 17, 'img/taevdl-galeria6.jpg', NULL),
(114, 17, 'img/taevdl-galeria7.jpg', NULL),
(115, 17, 'img/taevdl-galeria8.jpg', NULL),
(116, 17, 'img/taevdl-galeria9.jpg', NULL),
(117, 18, 'img/tm-galeria1.png', NULL),
(118, 18, 'img/tm-galeria2.png', NULL),
(119, 18, 'img/tm-galeria3.png', NULL),
(120, 18, 'img/tm-galeria4.png', NULL),
(121, 18, 'img/tm-galeria5.png', NULL),
(122, 18, 'img/tm-galeria6.png', NULL),
(123, 18, 'img/tm-galeria7.png', NULL),
(124, 18, 'img/tm-galeria8.png', NULL),
(125, 18, 'img/tm-galeria9.png', NULL),
(126, 19, 'img/tropa2-galeria1.jpg', NULL),
(139, 22, 'img/vitoria-galeria1.jpg', NULL),
(140, 22, 'img/vitoria-galeria2.jpg', NULL),
(141, 22, 'img/vitoria-galeria3.jpg', NULL),
(142, 22, 'img/vitoria-galeria4.jpg', NULL),
(143, 22, 'img/vitoria-galeria5.jpg', NULL),
(144, 22, 'img/vitoria-galeria6.jpg', NULL),
(145, 23, 'img/euv-galeria1.jpg', NULL),
(146, 23, 'img/euv-galeria2.jpg', NULL),
(147, 23, 'img/euv-galeria3.jpg', NULL),
(148, 23, 'img/euv-galeria4.jpg', NULL),
(149, 23, 'img/euv-galeria5.jpg', NULL),
(150, 24, 'img/nise-galeria1.jpg', NULL),
(151, 24, 'img/nise-galeria2.jpg', NULL),
(152, 24, 'img/nise-galeria3.jpg', NULL),
(153, 24, 'img/nise-galeria4.jpg', NULL),
(154, 24, 'img/nise-galeria5.jpg', NULL),
(155, 24, 'img/nise-galeria6.jpg', NULL),
(156, 25, 'img/mpdll-galeria1.jpg', NULL),
(157, 25, 'img/mpdll-galeria2.jpg', NULL),
(158, 25, 'img/mpdll-galeria3.jpg', NULL),
(159, 25, 'img/mpdll-galeria4.jpg', NULL),
(160, 25, 'img/mpdll-galeria5.jpg', NULL),
(161, 25, 'img/mpdll-galeria6.jpg', NULL),
(162, 25, 'img/mpdll-galeria7.jpg', NULL),
(163, 26, 'img/2coelhos-galeria1.jpg', NULL),
(164, 26, 'img/2coelhos-galeria2.jpg', NULL),
(165, 26, 'img/2coelhos-galeria3.jpg', NULL),
(166, 26, 'img/2coelhos-galeria4.jpg', NULL),
(167, 26, 'img/2coelhos-galeria5.jpg', NULL),
(168, 26, 'img/2coelhos-galeria6.jpg', NULL),
(169, 26, 'img/2coelhos-galeria7.jpg', NULL),
(170, 27, 'img/oteov-galeria1.jpg', NULL),
(171, 27, 'img/oteov-galeria2.jpg', NULL),
(172, 27, 'img/oteov-galeria3.jpg', NULL),
(173, 27, 'img/oteov-galeria4.jpg', NULL),
(174, 27, 'img/oteov-galeria5.jpg', NULL),
(175, 27, 'img/oteov-galeria6.jpg', NULL),
(176, 27, 'img/oteov-galeria7.jpg', NULL),
(177, 28, 'img/up174-galeria1.jpg', NULL),
(178, 28, 'img/up174-galeria2.jpg', NULL),
(179, 28, 'img/up174-galeria3.jpg', NULL),
(180, 28, 'img/up174-galeria4.jpg', NULL),
(181, 28, 'img/up174-galeria5.jpg', NULL),
(182, 28, 'img/up174-galeria6.jpg', NULL),
(183, 28, 'img/up174-galeria7.jpg', NULL),
(184, 29, 'img/cdh-galeria1.jpg', NULL),
(185, 29, 'img/cdh-galeria2.jpg', NULL),
(186, 29, 'img/cdh-galeria3.jpg', NULL),
(187, 29, 'img/cdh-galeria4.jpg', NULL),
(188, 29, 'img/cdh-galeria5.jpg', NULL),
(189, 29, 'img/cdh-galeria6.jpg', NULL),
(190, 30, 'img/stj-galeria1.jpg', NULL),
(191, 30, 'img/stj-galeria2.jpg', NULL),
(192, 30, 'img/stj-galeria3.jpg', NULL),
(193, 30, 'img/stj-galeria4.jpg', NULL),
(194, 30, 'img/stj-galeria5.jpg', NULL),
(195, 30, 'img/stj-galeria6.jpg', NULL),
(196, 30, 'img/stj-galeria7.jpg', NULL),
(197, 30, 'img/stj-galeria8.jpg', NULL),
(198, 31, 'img/eem-galeria1.jpg', NULL),
(199, 31, 'img/eem-galeria2.jpg', NULL),
(200, 31, 'img/eem-galeria3.jpg', NULL),
(201, 31, 'img/eem-galeria4.jpg', NULL),
(202, 31, 'img/eem-galeria5.jpg', NULL),
(203, 31, 'img/eem-galeria6.jpg', NULL),
(204, 32, 'img/uhdaef-galeria1.jpg', NULL),
(205, 32, 'img/uhdaef-galeria2.jpg', NULL),
(206, 32, 'img/uhdaef-galeria3.jpg', NULL),
(207, 32, 'img/uhdaef-galeria4.jpg', NULL),
(208, 32, 'img/uhdaef-galeria5.jpg', NULL),
(209, 32, 'img/uhdaef-galeria6.jpg', NULL),
(210, 32, 'img/uhdaef-galeria7.jpg', NULL),
(211, 32, 'img/uhdaef-galeria8.jpg', NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `plataformas`
--

CREATE TABLE `plataformas` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `logo_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `plataformas`
--

INSERT INTO `plataformas` (`id`, `nome`, `logo_url`) VALUES
(1, 'Netflix', 'img/logos/netflix.png'),
(2, 'Prime Video', 'img/logos/primevideo.png'),
(3, 'Globoplay', 'img/logos/globoplay.png'),
(4, 'Apple TV+', 'img/logos/appletv.svg'),
(5, 'Max', 'img/logos/max.svg'),
(6, 'Star+', 'img/logos/starplus.svg'),
(7, 'Telecine', 'img/logos/telecine.png'),
(8, 'Paramount+', 'img/logos/paramount.svg');

-- --------------------------------------------------------

--
-- Estrutura para tabela `recuperacao_senha`
--

CREATE TABLE `recuperacao_senha` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `data_expiracao` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nome_usuario` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `senha_hash` varchar(255) NOT NULL,
  `role` enum('dev','usuario') NOT NULL DEFAULT 'usuario',
  `data_cadastro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `usuarios`
--

INSERT INTO `usuarios` (`id`, `nome_usuario`, `email`, `senha_hash`, `role`, `data_cadastro`) VALUES
(1, 'Dev Denilson', 'devDenilson@nacionalflix.com', '$2b$10$4yCOzs1Z47EXaZUzRLIiKueB3uZxh9S4PWnvNRkmtn5DNrgTMrrFC', 'dev', '2025-10-06 18:20:32'),
(2, 'dev Natalia', 'devNatalia@nacionalflix.com', '$2b$10$Jwi/DeT6owgvYzmt7.ERUuSgSUDJ9xnjNY0b52RfoeEm.HcSfUT6u', 'dev', '2025-10-06 21:04:54'),
(3, 'Fulano', 'fulano@gmail.com', '$2b$10$uwYkcvjnFmwE8ogNlaAWN.3aWcgmuf3lJJdGZ3TZixtOG/dfSPX9C', 'usuario', '2025-10-06 21:05:17'),
(4, 'Teste', 'teste@teste.com', '$2b$10$P/7AsqCZnl2cStGleUyRRuDxE0/yZNHczOtV5FpmRB/A7ILJEE5GO', 'usuario', '2025-11-30 21:42:19');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario_plataformas`
--

CREATE TABLE `usuario_plataformas` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `plataforma_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `comentarios`
--
ALTER TABLE `comentarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `fk_com_filme` (`filme_id`);

--
-- Índices de tabela `filmes`
--
ALTER TABLE `filmes`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `filme_plataformas`
--
ALTER TABLE `filme_plataformas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `filme_plataforma_unico` (`filme_id`,`plataforma_id`),
  ADD KEY `plataforma_id` (`plataforma_id`);

--
-- Índices de tabela `historico_assistidos`
--
ALTER TABLE `historico_assistidos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario_filme_unico` (`usuario_id`,`filme_id`),
  ADD KEY `fk_hist_filme` (`filme_id`);

--
-- Índices de tabela `imagens_filme`
--
ALTER TABLE `imagens_filme`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_img_filme` (`filme_id`);

--
-- Índices de tabela `plataformas`
--
ALTER TABLE `plataformas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nome` (`nome`);

--
-- Índices de tabela `recuperacao_senha`
--
ALTER TABLE `recuperacao_senha`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Índices de tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Índices de tabela `usuario_plataformas`
--
ALTER TABLE `usuario_plataformas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario_plataforma_unico` (`usuario_id`,`plataforma_id`),
  ADD KEY `plataforma_id` (`plataforma_id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `comentarios`
--
ALTER TABLE `comentarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `filmes`
--
ALTER TABLE `filmes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT de tabela `filme_plataformas`
--
ALTER TABLE `filme_plataformas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT de tabela `historico_assistidos`
--
ALTER TABLE `historico_assistidos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de tabela `imagens_filme`
--
ALTER TABLE `imagens_filme`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=212;

--
-- AUTO_INCREMENT de tabela `plataformas`
--
ALTER TABLE `plataformas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de tabela `recuperacao_senha`
--
ALTER TABLE `recuperacao_senha`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `usuario_plataformas`
--
ALTER TABLE `usuario_plataformas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `comentarios`
--
ALTER TABLE `comentarios`
  ADD CONSTRAINT `comentarios_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_com_filme` FOREIGN KEY (`filme_id`) REFERENCES `filmes` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `filme_plataformas`
--
ALTER TABLE `filme_plataformas`
  ADD CONSTRAINT `filme_plataformas_ibfk_2` FOREIGN KEY (`plataforma_id`) REFERENCES `plataformas` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_plat_filme` FOREIGN KEY (`filme_id`) REFERENCES `filmes` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `historico_assistidos`
--
ALTER TABLE `historico_assistidos`
  ADD CONSTRAINT `fk_hist_filme` FOREIGN KEY (`filme_id`) REFERENCES `filmes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `historico_assistidos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `imagens_filme`
--
ALTER TABLE `imagens_filme`
  ADD CONSTRAINT `fk_img_filme` FOREIGN KEY (`filme_id`) REFERENCES `filmes` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `recuperacao_senha`
--
ALTER TABLE `recuperacao_senha`
  ADD CONSTRAINT `recuperacao_senha_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `usuario_plataformas`
--
ALTER TABLE `usuario_plataformas`
  ADD CONSTRAINT `usuario_plataformas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `usuario_plataformas_ibfk_2` FOREIGN KEY (`plataforma_id`) REFERENCES `plataformas` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
