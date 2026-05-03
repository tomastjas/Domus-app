/**
 * Estudos — Página de Estudos DOMUS
 * Design: "Lumen Argentum" — Elegância Litúrgica Moderna
 * Conteúdo: "Ouse Seguir Jesus" — 3 semanas (Oração, Estudo, Missão)
 */
import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  BookOpen,
  Flame,
  Handshake,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  Cross,
  Check,
  PenLine,
  Trash2,
  RotateCcw,
  Trophy,
} from "lucide-react";
import MobileMenu from "@/components/MobileMenu";
import { useProgress } from "@/hooks/useProgress";
import { useDiary } from "@/hooks/useDiary";
import { useAuthorization, ADMIN_EMAILS } from "@/hooks/useAuthorization";
import { useLocation } from "wouter";

/* ─── CDN URLs ─── */
const IMG = {
  sinal: "https://d2xsxph8kpxj0f.cloudfront.net/310519663390831948/BcraeUEdXMZSEHjX8DWEaS/domus_pingente_540d99c3.jpg",
  oracao: "https://d2xsxph8kpxj0f.cloudfront.net/310519663390831948/BcraeUEdXMZSEHjX8DWEaS/domus_oracao-HfqzpvXxH8FRG9q4ZLBvxh.webp",
  estudo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663390831948/BcraeUEdXMZSEHjX8DWEaS/domus_estudo-TzcXDfD7sVFrhUUo2n3zFc.webp",
  missao: "https://d2xsxph8kpxj0f.cloudfront.net/310519663390831948/BcraeUEdXMZSEHjX8DWEaS/domus_missao-MYvQXDHuMMQKdqfQtUyuhB.webp",
};

/* ─── Types ─── */
interface DayStudy {
  title: string;
  text: string;
  citation?: string;
  citationRef?: string;
  leitura: string;
  exercicio: string;
  pratica: string;
  terco: string;
}

interface WeekData {
  number: number;
  pilar: string;
  pilarLatin: string;
  icon: "oracao" | "estudo" | "missao";
  color: string;
  days: DayStudy[];
}

/* ─── Study Data ─── */
const WEEKS: WeekData[] = [
  {
    number: 1,
    pilar: "Oração",
    pilarLatin: "Oration",
    icon: "oracao",
    color: "#b8b8b8",
    days: [
      {
        title: "Intimidade",
        text: "A intimidade é algo que temos com quem confiamos e amamos, assim somos com Deus, a cada vez que decidimos estar juntos a Ele e conhecendo um pouco mais sobre Ele, Permitindo que Ele esteja em nós e criamos essa intimidade que nos leva a trilhar o caminho para a salvação.",
        leitura: "Tiago 2, 23 / Salmo 25, 14",
        exercicio: "Tirar uma hora do seu dia para contemplar o Santíssimo em silêncio.",
        pratica: "Durante o dia exercer a Virtude do silêncio.",
        terco: "Colocar como intenção o desejo de ter mais intimidade com Jesus no pessoal e em comunidade, clamando o desejo de ser obediente para seguir a vontade de Deus.",
      },
      {
        title: "Obediência",
        text: "É uma forma de glorificarmos a Deus quando obedecemos, seguimos a sua vontade deixando a nossa em Suas mãos por completo. A obediência nos transforma e faz-nos submeter a cada dia, olhar e reconhecer onde nós temos mais dificuldades a seguir.",
        citation: "O que observa o preceito guarda a sua vida, quem descuida do seu proceder morrerá.",
        citationRef: "Provérbios 19, 16",
        leitura: "Deuteronômio 28, 1-10",
        exercicio: "Rezar o Angelo 3 vezes ao dia: Matutino (06:00h ou 09:00h), Vespertino (12:00h), Noturno (18:00h ou 21:00h).",
        pratica: "Passe o dia obedecendo sem reclamar.",
        terco: "Colocar como intenção a prática da obediência e o desejo da caridade, para que possa ter mais empatia e misericórdia com o irmão em situações imprevistas.",
      },
      {
        title: "Comprometimento",
        text: "É o empenho que você dá para que o compromisso seja realizado. É um esforço, um agir, um programar e um querer diário é constante. O comprometimento requer de cada um a responsabilidade do compromisso assumido e como em tudo para a caminhada em Deus vem também com suas renúncias e suas graças.",
        citation: "Alegrai-vos em ser participantes do sofrimento de Cristo, para que vos possais alegrar e exultar no dia em que for manifestada a tua glória.",
        citationRef: "1 Pedro 4, 13",
        leitura: "1 Pedro 4, 7-19",
        exercicio: "Oração de São José: \"São José guardião de Jesus casto esposo de Maria, empenhaste toda Vossa vida no perfeito comprometimento de Vosso dever, Vos mantivestes a Sagrada Família de Nazaré com o trabalho de Vossas mãos protegei bondosamente aos que recorrem confiadamente a Vós.\" Amém!",
        pratica: "Comprometa-se a realizar as pequenas tarefas diárias com mais cuidado e atenção.",
        terco: "Colocar como intenção o pedido da intercessão de Nossa Senhora o modelo de comprometimento a inspiração para sermos fiéis e dedicados, clamando a Deus pelo divino Espírito Santo em nossas vidas.",
      },
      {
        title: "Fidelidade",
        text: "É ser digno de confiança, buscar cumprir e agir corretamente como Jesus que se faz exemplo. Fidelidade é ser alguém com quem se pode contar, no sentido do Espírito Santo é alguém que se deixa conduzir por completo por Ele.",
        citation: "Fidelidade é fruto do Espírito Santo.",
        leitura: "Gálatas 5, 22-26",
        exercicio: "Leitura e meditação do Salmo 19 (20).",
        pratica: "Exame de consciência baseado no quesito da fidelidade. A que você está sendo fiel? És fiel assim como queres a fidelidade do Senhor?",
        terco: "Colocar como intenção o pedido por fidelidade e sabedoria, que seus olhos possam se abrir e enxergar a vontade de Deus, que seus ouvidos possam se abrir e ouvir com clareza a voz de Deus e sua boca possa se abrir, para professar e clamar a palavra de Deus.",
      },
      {
        title: "Entendimento",
        text: "É tudo que nos leva a saber e fazer o que é certo. O entendimento em Deus vem com o agir da misericórdia, deixando de lado o julgamento e buscando mais o escutar e compreender, levando assim a Sabedoria Divina que é exatamente o oposto do entendimento meramente humano.",
        citation: "Quem pensa ser alguma coisa, não sendo nada, engana-se a si mesmo.",
        citationRef: "Gálatas 6, 3",
        leitura: "Gálatas 6, 1-5",
        exercicio: "Repetir a Ejaculatória durante o dia: \"Sagrado Coração de Jesus, Fazei meu coração semelhante ao Vosso.\"",
        pratica: "Durante o dia esteja mais disposto a pedir desculpa e compreender mais o seu irmão ou sua irmã.",
        terco: "Colocar como intenção o entendimento Divino sobre a sua vida, ações e palavras, que o tire da ignorância humana e o torne mais fiel a Deus.",
      },
      {
        title: "Incômodo",
        text: "É algo que não é cômodo. Que nos tira da mesmice, que inquieta a melhorar, a mudar e buscar ir além do que se conhece, do que está acostumado. O incômodo nos deixa alerta, e faz-nos passar por um processo e questionar se estamos a fazer o certo, é o impulso que nos dá a coragem para fazer a vontade de Deus se cumprir.",
        citation: "Orar sem cessar.",
        citationRef: "1 Tessalonicenses 5, 17",
        leitura: "1 Tessalonicenses 5, 16-28",
        exercicio: "Oração pelas vocações: \"Senhor da Messe e pastor do rebanho faz ressoar em nossos ouvidos teu forte e suave convite: 'Vem e segue-me'. Derrama sobre nós o teu Espírito, que Ele nos dê sabedoria para ver o caminho e generosidade para seguir tua voz.\" Amém!",
        pratica: "Saia da sua zona de conforto hoje e faça uma visita na casa de alguém e leve a palavra de Deus. A visita não deve ser planejada ou programada, apenas IDE.",
        terco: "Colocar como intenção coragem para sair do comodismo e novamente se incomodar com as coisas do mundo a ponto de cada dia estar mais entregue a Jesus.",
      },
      {
        title: "Procura",
        text: "Procura é desejo de saber e conhecer mais do que lhe chama atenção, lhe inquieta ou incomoda. A procura nos leva a ligar a oração com o estudo onde cria-se a base da fé. Na Bíblia aprendemos a verdade sobre Deus e seu grande amor por nós, também nos ensina como verdadeiramente orarmos e pedir aquilo que é necessário.",
        citation: "Quando vocês me invocarem, rezarão a mim, e eu os ouvirei. Vocês me procurarão, e me encontrarão, se me buscarem de todo o coração.",
        citationRef: "Jeremias 29, 12-13",
        leitura: "Mateus 7, 7-12",
        exercicio: "Oração de São Tomás de Aquino: \"Ó Deus, fonte de toda sabedoria, pelos méritos de São Tomás de Aquino. Conceda-me a graça de entender o que é verdadeiro e justo e de viver segundo a Tua vontade.\" Amém!",
        pratica: "Encontre um guia espiritual. O guia espiritual pode ser um sacerdote ou religioso, alguém que possa lhe oferecer aconselhamentos, direção e apoio espiritual na busca da proximidade com Deus.",
        terco: "Colocar como intenção a graça da conversão e que Deus aumente a fome e a sede de buscar diariamente, não se contentando com o pouco.",
      },
    ],
  },
  {
    number: 2,
    pilar: "Estudo",
    pilarLatin: "Studium",
    icon: "estudo",
    color: "#c9822a",
    days: [
      {
        title: "Conhecimento",
        text: "É o que nos faz entender, compreender e aprender. O conhecimento nos leva a experimentar algo novo, nos aprofundando e fortalecendo a nossa fé. Mas tendo em nossa mente que o conhecimento nas coisas de Deus não nos é dado 100% pois em sua maioria das vezes as coisas se fazem inexplicável.",
        leitura: "Romanos 15, 4-6",
        exercicio: "Ejaculatória — Repetir quantas vezes puder ao dia: \"Espírito Santo, guia-me para a verdade.\"",
        pratica: "Exame de consciência: Reflita sobre pensamento, palavras e ações, na intenção de buscar o arrependimento. Procurar se confessar até o fim do estudo.",
        terco: "Colocar como intenção a graça do conhecimento Divino para que possamos alcançar a Santidade.",
      },
      {
        title: "Sabedoria",
        text: "Aplica-se ao conhecimento de agir com prudência nas diversas situações em nossa vida. A sabedoria vinda de Deus é irracional ao entendimento humano, pois ela nos dá o temor a Deus, humildade, justiça e equidade, prudência, discernimento, amor e misericórdia.",
        leitura: "1 Pedro 2, 13-20",
        exercicio: "Leitura e ressonância do livro da Sabedoria — Capítulo 9.",
        pratica: "Durante o dia de hoje esteja mais suscetível a agradecer.",
        terco: "Colocar como intenção o pedido da sabedoria divina em sua vida, rogando à Virgem Maria que o ajude a ser merecedor dessa tamanha graça.",
      },
      {
        title: "Dedicação",
        text: "É o ato de se empenhar em algo que você tenha se comprometido, doar seu tempo, fazer renúncias, encarar o sacrifício como um aprendizado diário. A dedicação dá sentido ao propósito almejado e consequentemente nos torna mais fortes e sábios nas escolhas que temos que fazer em nossas vidas.",
        citation: "Escolher ao que se dedicar, sem dúvida muda o percurso da nossa história.",
        citationRef: "Jackeline Lima",
        leitura: "1 Timóteo 4, 13-16",
        exercicio: "Oração de São José: \"Oh! Deus, que ofereceis a São José como modelo da verdadeira devoção ao Sagrado Coração de Jesus e de Maria, a Ele nos dá como patrono em meio das provas que afligem ao mundo e igreja. Concedei-nos por sua intercessão a graça de chegar a sermos verdadeiros filhos destes Sagrados Corações. Vós pedimos pelo mesmo Jesus Cristo Nosso Senhor.\" Amém!",
        pratica: "Dedique o seu dia a servir ao próximo: em casa, no trabalho, conhecidos e desconhecidos.",
        terco: "Colocar como intenção a súplica por coragem e fé, para que ambos os ajude a seguir sempre firme.",
      },
      {
        title: "Discernimento",
        text: "Nos faz trabalhar a virtude da paciência e humildade, pois o discernimento nos ensina o ato de pensar com clareza perante uma situação, agindo na paciência e não impulso. Discernir nos leva a questionar sem julgar e avaliar sem condenar, despertando em nós mais empatia e misericórdia.",
        leitura: "2 Timóteo 2, 1-7",
        exercicio: "Oremos: \"Senhor Deus nós vos suplicamos que concedais a vossos servos gozar uma perpétua saúde do corpo e da alma, que pela intercessão gloriosa da bem aventurada Virgem Maria sejamos livres da presente tristeza e gozemos a eterna alegria. Por Jesus Cristo, Nosso Senhor.\" Amém!",
        pratica: "Tire um dia para refletir: Quais são os meus valores e prioridades cristãos? Como posso equilibrar a fé com a razão e a emoção? Qual o propósito de Deus em minha vida?",
        terco: "Colocar como intenção a súplica por estar sempre disposto à vontade de Deus e deixar-se agir pelo Espírito Santo.",
      },
      {
        title: "Perda da Ignorância",
        text: "A ignorância é a falta de conhecimento. O que só nos leva ao orgulho e prepotência por somente \"achar\" e não ter \"certeza\" de nada. O estudo da palavra de Deus nos tira dessa ignorância pois nos faz reconhecer primeiramente nossos pecados e abre o nosso coração e mentalidade para a sabedoria de Deus e seus preceitos.",
        leitura: "1 Coríntios 12, 1-31",
        exercicio: "Reflita a respeito dos dons espirituais já reconhecidos e despertos em ti. Reflita sobre os dons ainda necessários para bem servir. Identifique os pontos que estás na ignorância e busque um meio para se abrir ao Espírito Santo.",
        pratica: "Coloque em prática os dons a ti dado por Deus. \"Não recebestes um dom para ficar olhando pro nada.\"",
        terco: "Colocar como intenção o pedido da obediência, para que obedientes possamos colocar nossos dons a servir de Deus, que possamos deixar de lado o orgulho que nos faz prepotentes, para servir com amor e não por obrigação.",
      },
      {
        title: "Reflexão",
        text: "É o ato racional de uma pessoa pensar, observar e analisar seus pensamentos, tudo isso nos foi dado por Deus, a sua palavra viva nos faz compreender aquilo que a consciência vai desenvolvendo com as nossas experiências. O ato de refletir evita que possamos cometer um possível erro à frente. A reflexão nos faz parar e pensar, sair da agitação e trazer a calmaria para as nossas palavras e ações.",
        citation: "Quem precipita seus passos desvia-se.",
        citationRef: "Provérbios 9, 2",
        leitura: "Provérbios 2, 1-11",
        exercicio: "Oração a Santa Terezinha: \"Ó Santa Terezinha do menino Jesus, modelo de humildade, de confiança e de amor! Do alto dos céus despeje sobre nós estas rosas que levas em teus braços: a rosa da humildade, a rosa da confiança e a rosa do amor.\" Amém!",
        pratica: "Reserve um momento para refletir sobre si próprio, suas atitudes, seus sonhos e suas vontades. Tudo isso tem te levado a Deus?",
        terco: "Colocar como intenção o desejo de ser mais reflexivo, que a calmaria seja presente em seus pensamentos e ações, que a Virgem Maria venha com seu moldar e te dê a virtude da doçura.",
      },
      {
        title: "Direção",
        text: "É um caminho a seguir! A palavra de Deus nos apresenta este caminho e nos direciona a Ele. Como Luz em nosso caminho, Deus no seu imenso amor se direciona a nós, nos conduzindo a vida plena. Segui-lo não é fácil, mas é a certeza que caminhamos para o Céu, pois pode existir várias direções para se viver, mas para se alcançar a vida eterna, somente há uma direção que é o nosso Senhor Jesus Cristo.",
        citation: "Senhor, a quem iremos nós? Tu Tens a palavra da vida eterna.",
        citationRef: "João 6, 68",
        leitura: "Provérbios 2, 12-20",
        exercicio: "Repetir quantas vezes for necessário: \"Deus dá-me sabedoria e discernimento. Deus dá-me inteligência para conhecer-te, sabedoria para amar-te e força para servir-te.\" — São Tomás de Aquino",
        pratica: "Escreva todas as direções tomadas em sua vida, tendo reconhecimento que foi tomada por Deus ou não. Anote os desafios e obstáculos encontrados em cada direção tomada. Anote todos os processos de aprendizado e crescimento espiritual.",
        terco: "Colocar como intenção: \"Pai Celeste eu vos peço que me dirija e me guie em todas as minhas escolhas, dai-me paz e serenidade para confiar em vosso plano.\" Amém!",
      },
    ],
  },
  {
    number: 3,
    pilar: "Missão",
    pilarLatin: "Missio",
    icon: "missao",
    color: "#e8a832",
    days: [
      {
        title: "Experiência",
        text: "Vem de algo que vivenciamos, nos leva além do conhecimento em estudo, nos faz viver aquilo o quão falamos assim como deve ser a nossa caminhada e vida com Deus. Aprender a buscá-lo não só nos estudos e na oração, mas também na missão e vivência diária da nossa vida, experimentando assim o amor de Deus sempre.",
        citation: "Aqueles que foram uma vez iluminados saborearam o dom Celestial, participaram dos dons do Espírito Santo. Experimentaram a doçura da palavra de Deus e as maravilhas do mundo vindouro.",
        citationRef: "Hebreus 6, 4-5",
        leitura: "Jó 42, 5-6",
        exercicio: "Reflita a passagem Mateus 8, 18-22. Faça o seguinte questionamento: Estou preparado para realmente assumir a missão em nome de Jesus?",
        pratica: "Visite um familiar que não tem contato e evangelize falando da sua experiência com Deus.",
        terco: "Colocar como intenção o pedido por coragem para que tua maior experiência com Deus saia primeiramente em teu lar.",
      },
      {
        title: "Testemunho",
        text: "É aquilo que nos modifica e nos dá um aprendizado. Além de nós mesmo em especial, atinge e modifica a vida do próximo. O testemunho gera conversão, a conversão bem vivida nos leva à vida. A nossa vida é um constante testemunho, como em tudo temos escolhas, no testemunho não é diferente e cabe refletir se estamos dando testemunho para o mundo ou para Deus.",
        leitura: "1 João 5, 1-3",
        exercicio: "Reflita a frase de Chiara Corbella: \"Para escutar a Deus é preciso: Aceitar, não entender. Estar disposto a sofrer. Renunciar o mal e escolher o bem.\" Em seguida pesquise e estude sobre a história de Chiara Corbella.",
        pratica: "Sem esperar que alguém chame ou peça, faça algo a mais do que já está acostumado a servir na igreja: limpeza, leitura, ajudar os coroinhas, colher flores para o Santíssimo, acolher os irmãos.",
        terco: "Colocar como intenção o pedido de um verdadeiro testemunho, que sua vida seja repleta do Espírito Santo e possa ser transbordado em suas ações e palavras.",
      },
      {
        title: "Mudança",
        text: "A mudança em Deus e para Deus vem do interno externo do nosso ser, nos leva a ir o total contrário ao mundo. Vivemos em constantes mudanças do nosso físico, gostos, vestimentas, trabalho, estudo — e nem sempre isso está em concórdia, mas a mudança em Deus faz o nosso processo andar em comum para o único propósito que é chegar a vida eterna.",
        leitura: "Romanos 12, 1-12",
        exercicio: "Repita quantas vezes puder ao dia: \"Nunca é tarde para mudar.\"",
        pratica: "Assista o filme \"Luta pela fé\" que relata a história do padre Stuart Ignatius Long. Faça uma reflexão em seu diário espiritual.",
        terco: "Colocar como intenção o pedido de coragem para ir contra os desejos que nos afasta de Deus, prudência para saber calar e silenciar, atitude para saber como é a hora certa de falar.",
      },
      {
        title: "Conversão",
        text: "É diária e não é passageira, mas é passado para o próximo a partir do momento que a guardamos e alimentamos em nosso coração. A conversão é a mudança do coração e mente, abandono de hábitos e atitudes negativas. São 3 tipos: a conversão inicial (o primeiro encontro com Deus), conversão contínua (o crescimento espiritual gradual) e conversão radical (mudança drástica e repentina).",
        citation: "Todo aquele que está em Cristo é uma nova criatura. Passou o que era velho; eis que tudo se fez novo.",
        citationRef: "2 Coríntios 5, 17",
        leitura: "Deuteronômio 6, 6-8",
        exercicio: "Reze e reflita a oração de Santo Agostinho: \"Bem-aventurado Santo Agostinho, lembrai-vos, na vossa glória, dos pobres pecadores. Como Vós outrora eles hoje trilham os caminhos do mal arrastados pela ignorância ou pelas paixões.\" Amém!",
        pratica: "Inicie hoje, se caso já não tiver o costume, de orar com a família antes das refeições agradecendo e bendizendo ao Senhor por sua bondade, providência e misericórdia.",
        terco: "Colocar como intenção o agradecimento pela misericórdia de Nosso Senhor em nossas vidas e pedir que nos conceda uma fé firme e perseverante para que consigamos alcançar a verdadeira conversão.",
      },
      {
        title: "Maturidade",
        text: "É o crescimento espiritual e carnal, a maturidade em Deus vai nos moldando e fazendo parecido a Ele, assim como saímos da fase de criança para adolescente e adultos na vida carnal, na vida espiritual não é diferente. A missão dada por Deus vai nos moldando e amadurece todo nosso ser, nos fazendo sair da semente e nos tornando árvores nos fazendo dar frutos.",
        citation: "Não persistais em viver como pagãos que andam à mercê de suas ideias frívolas.",
        citationRef: "Efésios 4, 17",
        leitura: "Efésios 4, 13-16",
        exercicio: "Reflita, em seu crescimento espiritual, analisando os passos já dados e raízes firmadas na fé. E na missão dada por Deus, reveja o quanto de maturidade adquiristes e quais os frutos produzidos em ti.",
        pratica: "Faça a prática de um jejum de algo prazeroso pra você com a intenção de aprofundar sua busca na maturidade.",
        terco: "Colocar como intenção o pedido pela virtude da humildade para que com simplicidade possamos conduzir nosso coração e pensamentos, reconhecer nossas limitações e ser mais dependentes de Deus.",
      },
      {
        title: "Confiança",
        text: "É onde depositamos o nosso entendimento, tempo, maturidade, testemunho, intimidade e nossas experiências. A confiança nos leva a ser leais e verdadeiros, para seguir a missão precisamos ter a confiança total em Deus, pois por ela agiremos entendendo ou não, sem questionar, somente confiando.",
        citation: "Bendito homem que deposita a confiança no Senhor e cuja a esperança é o Senhor.",
        citationRef: "Jeremias 17, 7",
        leitura: "Atos dos Apóstolos 4, 1-31",
        exercicio: "Reze e reflita o Salmo 90 (91).",
        pratica: "Reserve 10 minutos para refletir sobre confiança. Vá a procura dos teus conhecidos e amigos que estão afastados de Deus e evangelize falando como é bom confiar em Deus.",
        terco: "Colocar como intenção o agradecimento pela vida e o pedido para que conceda a nós a alegria de sempre confiar no amor de Deus.",
      },
      {
        title: "Fortalecimento",
        text: "A palavra de Deus é o que nos dá esse fortalecimento para seguir a missão, depois de nos abandonarmos no Espírito Santo somos preenchidos pelo Fogo Abrasador que vai consumindo o nosso melhor e queimando o nosso pior, vai nos deixando fortes e sedentos da palavra de Deus a cada missão vivida, pois Sua palavra é vida e Sua vida em nós é missão. IDE!",
        citation: "Conservemo-nos firmemente apegados à nossa esperança porque é fiel aquele cujo promessa aguardamos. Olhemos uns pelos outros para estímulo à caridade e as boas obras.",
        citationRef: "Hebreus 10, 23-24a",
        leitura: "Filipenses 4, 10-14",
        exercicio: "Pesquise e estude a biografia do Santo Dom Bosco. \"O sonho de Dom Bosco aos 9 anos é considerado uma profecia que marcou a sua vida e que o inspirou a cuidar e transformar a vida dos jovens.\"",
        pratica: "Assista o filme que conta a história de Dom Bosco e anote em seu diário o que lhe chama mais atenção.",
        terco: "Colocar como intenção o pedido pela vida de todos os jovens, que o Espírito Santo possa estar presente no meio da juventude os dando fé e sabedoria para combater as armadilhas do inimigo.",
      },
    ],
  },
];

/* ─── Intro Data ─── */
const INTRO = {
  title: "Ouse Seguir Jesus",
  subtitle: "Mesmo quando o caminho é desconhecido",
  motto: "Oração, estudo e missão nos moldam pra viver a vocação",
  text: "Deus nos coloca no coração um chamado diferente e parece que ele está gritando: \"Agiliza, o Céu é dos violentos\", assim ele vai nos dando um coração ardente e pés a caminho.",
  hereToServe: "Quem quiser ser o primeiro entre vocês, sejam o servo de todos.",
  hereToServeRef: "Mateus 20, 27",
  closing: "Os nossos dons só são válidos se colocarmos em prática para o outro, então exercitamos e aprendemos para se tornar uma tocha incendiada.",
};

/* ─── Scroll hook ─── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ═══════════════════════════════════════════════════
   NAV
   ═══════════════════════════════════════════════════ */
function StudyNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const isAdmin = useMemo(() => {
    try {
      const stored = localStorage.getItem("domus_user");
      if (!stored) return false;
      const user = JSON.parse(stored);
      return ADMIN_EMAILS.includes(user.email?.toLowerCase());
    } catch { return false; }
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(13,11,9,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(184,184,184,0.08)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <ArrowLeft size={16} style={{ color: "#b8b8b870" }} />
          <span
            className="text-sm tracking-[0.15em] uppercase transition-colors duration-300"
            style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b870" }}
          >
            Domus
          </span>
        </Link>
        <div className="hidden sm:flex items-center gap-6">
          <span
            className="text-sm tracking-[0.2em] uppercase"
            style={{ fontFamily: "'Cinzel', serif", color: "#c9822a" }}
          >
            Estudos
          </span>
          <Link
            href="/diario"
            className="text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:opacity-100 opacity-60"
            style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b8" }}
          >
            Diário
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:opacity-100 opacity-80"
              style={{ fontFamily: "'Cinzel', serif", color: "#e8a040" }}
            >
              ⚙ Admin
            </Link>
          )}
        </div>
        <MobileMenu
          links={[
            { label: "Início", href: "/", isRoute: true },
            { label: "Estudos", href: "/estudos", isRoute: true, highlight: true },
            { label: "Diário", href: "/diario", isRoute: true },
          ]}
        />
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════ */
function StudyHero() {
  const { ref, visible } = useInView(0.2);

  return (
    <section
      ref={ref}
      className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
      style={{ background: "#0d0b09" }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center animate-slow-zoom opacity-30"
        style={{ backgroundImage: `url(${IMG.estudo})` }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, rgba(13,11,9,0.6) 0%, rgba(13,11,9,0.4) 40%, rgba(13,11,9,0.85) 80%, #0d0b09 100%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.2 }}
        className="relative z-10 text-center px-6 max-w-3xl mx-auto pt-24"
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <BookOpen size={20} style={{ color: "#c9822a60" }} />
          <span
            className="text-xs tracking-[0.4em] uppercase"
            style={{ fontFamily: "'Cinzel', serif", color: "#c9822a60" }}
          >
            Família JUF · Editora Tocha
          </span>
        </div>

        <h1
          className="text-4xl sm:text-5xl md:text-6xl tracking-[0.12em] uppercase text-emboss-gold mb-4"
          style={{ fontFamily: "'Cinzel', serif", color: "#c9822a" }}
        >
          {INTRO.title}
        </h1>

        <p
          className="text-lg sm:text-xl mb-8"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: "#b8b8b8a0",
          }}
        >
          {INTRO.subtitle}
        </p>

        <div className="amber-line mx-auto mb-8" style={{ maxWidth: "200px" }} />

        <p
          className="text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-6"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: "#b8b8b870",
            lineHeight: 1.8,
          }}
        >
          {INTRO.text}
        </p>

        <div
          className="inline-block px-6 py-3 mt-4"
          style={{
            border: "1px solid #c9822a30",
            background: "rgba(201,130,42,0.05)",
          }}
        >
          <p
            className="text-xs tracking-[0.3em] uppercase"
            style={{ fontFamily: "'Cinzel', serif", color: "#c9822a80" }}
          >
            Oration · Studium · Missio
          </p>
        </div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   WEEK SELECTOR
   ═══════════════════════════════════════════════════ */
function WeekSelector({
  activeWeek,
  setActiveWeek,
}: {
  activeWeek: number;
  setActiveWeek: (w: number) => void;
}) {
  const { ref, visible } = useInView(0.2);
  const weekIcons = [
    { icon: <Handshake size={22} />, label: "Oração", latin: "Oration" },
    { icon: <BookOpen size={22} />, label: "Estudo", latin: "Studium" },
    { icon: <Flame size={22} />, label: "Missão", latin: "Missio" },
  ];

  return (
    <section
      ref={ref}
      id="semanas"
      className="relative py-20"
      style={{ background: "#0d0b09" }}
    >
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <h2
            className="text-2xl sm:text-3xl tracking-[0.15em] uppercase text-emboss mb-4"
            style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b8" }}
          >
            Três Semanas de Formação
          </h2>
          <p
            className="text-sm"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              color: "#b8b8b860",
            }}
          >
            Selecione uma semana para explorar os estudos diários
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {weekIcons.map((w, i) => {
            const isActive = activeWeek === i;
            const week = WEEKS[i];
            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={visible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
                onClick={() => setActiveWeek(i)}
                className="relative group text-left p-6 sm:p-8 transition-all duration-500"
                style={{
                  background: isActive
                    ? `linear-gradient(135deg, rgba(${i === 0 ? "184,184,184" : i === 1 ? "201,130,42" : "232,168,50"},0.08), rgba(13,11,9,0.95))`
                    : "rgba(255,255,255,0.02)",
                  border: `1px solid ${isActive ? week.color + "40" : "rgba(184,184,184,0.06)"}`,
                }}
              >
                <div
                  className="mb-4 transition-colors duration-300"
                  style={{ color: isActive ? week.color : "#b8b8b840" }}
                >
                  {w.icon}
                </div>
                <p
                  className="text-xs tracking-[0.3em] uppercase mb-1 transition-colors duration-300"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    color: isActive ? week.color + "80" : "#b8b8b830",
                  }}
                >
                  Semana {i + 1}
                </p>
                <h3
                  className="text-xl tracking-[0.1em] uppercase transition-colors duration-300"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    color: isActive ? week.color : "#b8b8b860",
                  }}
                >
                  {w.label}
                </h3>
                <p
                  className="text-xs mt-2 tracking-[0.15em] uppercase transition-colors duration-300"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    color: isActive ? week.color + "50" : "#b8b8b820",
                  }}
                >
                  {w.latin}
                </p>

                {/* Active indicator line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[2px] transition-all duration-500"
                  style={{
                    background: isActive
                      ? `linear-gradient(90deg, transparent, ${week.color}, transparent)`
                      : "transparent",
                  }}
                />
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   DAY CARD (Accordion)
   ═══════════════════════════════════════════════════ */
function DayCard({
  day,
  dayIndex,
  weekIndex,
  weekColor,
  weekLabel,
  delay,
  isCompleted,
  onToggleComplete,
  onAddDiary,
}: {
  day: DayStudy;
  dayIndex: number;
  weekIndex: number;
  weekColor: string;
  weekLabel: string;
  delay: number;
  isCompleted: boolean;
  onToggleComplete: () => void;
  onAddDiary: (text: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [diaryText, setDiaryText] = useState("");
  const [showDiaryInput, setShowDiaryInput] = useState(false);
  const { ref, visible } = useInView(0.1);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="overflow-hidden transition-all duration-500"
      style={{
        background: open ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.01)",
        border: `1px solid ${open ? weekColor + "25" : "rgba(184,184,184,0.05)"}`,
      }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-5 sm:p-6 text-left group transition-all duration-300 hover:bg-white/[0.02]"
      >
        {/* Completion checkbox */}
        <div
          onClick={(e) => { e.stopPropagation(); onToggleComplete(); }}
          className="w-8 h-8 flex items-center justify-center shrink-0 transition-all duration-300 cursor-pointer"
          style={{
            border: `1px solid ${isCompleted ? weekColor + '80' : weekColor + '30'}`,
            background: isCompleted ? weekColor + '20' : 'transparent',
            color: weekColor,
            fontSize: "13px",
            fontFamily: "'Cinzel', serif",
          }}
          title={isCompleted ? "Marcar como pendente" : "Marcar como concluído"}
        >
          {isCompleted ? <Check size={16} /> : dayIndex + 1}
        </div>
        <div className="flex-1">
          <h4
            className="text-base sm:text-lg tracking-[0.08em] uppercase transition-colors duration-300"
            style={{
              fontFamily: "'Cinzel', serif",
              color: open ? weekColor : "#b8b8b8c0",
            }}
          >
            {day.title}
          </h4>
          <p
            className="text-xs mt-1 tracking-[0.1em] uppercase"
            style={{
              fontFamily: "'Cinzel', serif",
              color: "#b8b8b840",
            }}
          >
            Leitura: {day.leitura}
          </p>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ color: weekColor + "60" }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>

      {/* Content */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <div
              className="px-5 sm:px-6 pb-6 space-y-6"
              style={{ borderTop: `1px solid ${weekColor}10` }}
            >
              {/* Reflexão */}
              <div className="pt-5">
                <p
                  className="text-base leading-relaxed"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: "#d4d4d4c0",
                    lineHeight: 1.85,
                    fontSize: "17px",
                  }}
                >
                  {day.text}
                </p>
              </div>

              {/* Citation */}
              {day.citation && (
                <div
                  className="py-4 px-5"
                  style={{
                    borderLeft: `2px solid ${weekColor}40`,
                    background: `${weekColor}08`,
                  }}
                >
                  <p
                    className="text-base leading-relaxed"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontStyle: "italic",
                      color: weekColor + "d0",
                      lineHeight: 1.7,
                    }}
                  >
                    "{day.citation}"
                  </p>
                  {day.citationRef && (
                    <p
                      className="text-xs mt-2 tracking-[0.1em] uppercase text-right"
                      style={{
                        fontFamily: "'Cinzel', serif",
                        color: weekColor + "60",
                      }}
                    >
                      — {day.citationRef}
                    </p>
                  )}
                </div>
              )}

              {/* Sections */}
              <div className="space-y-5">
                {[
                  { label: "Leitura Bíblica", content: day.leitura, icon: "📖" },
                  { label: "Exercício Espiritual", content: day.exercicio, icon: "🙏" },
                  { label: "Prática Espiritual", content: day.pratica, icon: "✝️" },
                  { label: "Oração do Santo Terço", content: day.terco, icon: "🙌🏻" },
                ].map((section) => (
                  <div key={section.label}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm">{section.icon}</span>
                      <h5
                        className="text-xs tracking-[0.15em] uppercase"
                        style={{
                          fontFamily: "'Cinzel', serif",
                          color: weekColor + "90",
                        }}
                      >
                        {section.label}
                      </h5>
                    </div>
                    <p
                      className="text-sm leading-relaxed pl-6"
                      style={{
                        fontFamily: "'Source Sans 3', sans-serif",
                        color: "#b8b8b8a0",
                        lineHeight: 1.75,
                      }}
                    >
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>

              {/* Diário Espiritual */}
              <div
                className="pt-4"
                style={{ borderTop: `1px solid ${weekColor}10` }}
              >
                {!showDiaryInput ? (
                  <div className="flex items-center justify-between">
                    <p
                      className="text-xs tracking-[0.2em] uppercase"
                      style={{
                        fontFamily: "'Cinzel', serif",
                        color: "#b8b8b840",
                      }}
                    >
                      Oração Final — Retorne à oração inicial
                    </p>
                    <button
                      onClick={() => setShowDiaryInput(true)}
                      className="flex items-center gap-2 px-3 py-1.5 transition-all duration-300 hover:bg-white/[0.03]"
                      style={{
                        border: `1px solid ${weekColor}20`,
                        fontFamily: "'Cinzel', serif",
                        fontSize: "10px",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase" as const,
                        color: weekColor + "80",
                      }}
                    >
                      <PenLine size={12} />
                      Anotar reflexão
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <PenLine size={14} style={{ color: weekColor + "80" }} />
                      <h5
                        className="text-xs tracking-[0.15em] uppercase"
                        style={{ fontFamily: "'Cinzel', serif", color: weekColor + "90" }}
                      >
                        Diário Espiritual
                      </h5>
                    </div>
                    <textarea
                      value={diaryText}
                      onChange={(e) => setDiaryText(e.target.value)}
                      placeholder="Escreva sua reflexão sobre este estudo..."
                      className="w-full p-4 text-sm leading-relaxed resize-none focus:outline-none"
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        border: `1px solid ${weekColor}20`,
                        color: "#d4d4d4c0",
                        fontFamily: "'Source Sans 3', sans-serif",
                        minHeight: "100px",
                      }}
                      rows={4}
                    />
                    <div className="flex items-center gap-3 justify-end">
                      <button
                        onClick={() => { setShowDiaryInput(false); setDiaryText(""); }}
                        className="px-3 py-1.5 text-xs tracking-wider uppercase transition-all duration-300 hover:bg-white/[0.03]"
                        style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b860", border: "1px solid #b8b8b815" }}
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => {
                          if (diaryText.trim()) {
                            onAddDiary(diaryText.trim());
                            setDiaryText("");
                            setShowDiaryInput(false);
                          }
                        }}
                        className="px-4 py-1.5 text-xs tracking-wider uppercase transition-all duration-300 hover:brightness-110"
                        style={{
                          fontFamily: "'Cinzel', serif",
                          color: "#0d0b09",
                          background: weekColor,
                          border: `1px solid ${weekColor}`,
                        }}
                      >
                        Salvar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   WEEK CONTENT
   ═══════════════════════════════════════════════════ */
function WeekContent({
  activeWeek,
  isDayCompleted,
  toggleDay,
  getWeekProgress,
  addDiaryEntry,
}: {
  activeWeek: number;
  isDayCompleted: (w: number, d: number) => boolean;
  toggleDay: (w: number, d: number) => void;
  getWeekProgress: (w: number, total: number) => { completed: number; total: number; percent: number };
  addDiaryEntry: (wi: number, di: number, wl: string, dl: string, text: string) => void;
}) {
  const week = WEEKS[activeWeek];
  const bgImages = [IMG.oracao, IMG.estudo, IMG.missao];
  const weekProg = getWeekProgress(activeWeek, week.days.length);

  return (
    <section className="relative py-16 sm:py-20" style={{ background: "#0d0b09" }}>
      {/* Subtle background */}
      <div
        className="absolute inset-0 opacity-[0.04] bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImages[activeWeek]})` }}
      />
      <div className="absolute inset-0" style={{ background: "rgba(13,11,9,0.92)" }} />

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        {/* Week header */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeWeek}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p
              className="text-xs tracking-[0.35em] uppercase mb-3"
              style={{ fontFamily: "'Cinzel', serif", color: week.color + "50" }}
            >
              Semana {week.number} · {week.pilarLatin}
            </p>
            <h3
              className="text-3xl sm:text-4xl tracking-[0.12em] uppercase mb-4"
              style={{ fontFamily: "'Cinzel', serif", color: week.color }}
            >
              {week.pilar}
            </h3>

            {/* Progress bar */}
            <div className="max-w-xs mx-auto mb-4">
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-[10px] tracking-[0.2em] uppercase"
                  style={{ fontFamily: "'Cinzel', serif", color: week.color + "60" }}
                >
                  Progresso
                </span>
                <span
                  className="text-[10px] tracking-[0.15em]"
                  style={{ fontFamily: "'Cinzel', serif", color: week.color + "80" }}
                >
                  {weekProg.completed}/{weekProg.total}
                </span>
              </div>
              <div
                className="w-full h-[3px] overflow-hidden"
                style={{ background: week.color + "15" }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${weekProg.percent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full"
                  style={{ background: `linear-gradient(90deg, ${week.color}80, ${week.color})` }}
                />
              </div>
              {weekProg.percent === 100 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-2 mt-3"
                >
                  <Trophy size={14} style={{ color: "#c9822a" }} />
                  <span
                    className="text-[10px] tracking-[0.2em] uppercase"
                    style={{ fontFamily: "'Cinzel', serif", color: "#c9822a" }}
                  >
                    Semana concluída!
                  </span>
                </motion.div>
              )}
            </div>

            <div
              className="mx-auto"
              style={{
                width: "120px",
                height: "2px",
                background: `linear-gradient(90deg, transparent, ${week.color}, transparent)`,
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Day cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeWeek}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-3"
          >
            {week.days.map((day, i) => (
              <DayCard
                key={`${activeWeek}-${i}`}
                day={day}
                dayIndex={i}
                weekIndex={activeWeek}
                weekColor={week.color}
                weekLabel={week.pilar}
                delay={i * 0.08}
                isCompleted={isDayCompleted(activeWeek, i)}
                onToggleComplete={() => toggleDay(activeWeek, i)}
                onAddDiary={(text) => addDiaryEntry(activeWeek, i, week.pilar, day.title, text)}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   VENI CREATOR SECTION
   ═══════════════════════════════════════════════════ */
function VeniCreatorSection() {
  const { ref, visible } = useInView(0.15);
  const [showFull, setShowFull] = useState(false);

  return (
    <section
      ref={ref}
      className="relative py-20 sm:py-28"
      style={{ background: "#0d0b09" }}
    >
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <Cross size={20} className="mx-auto mb-6" style={{ color: "#b8b8b830" }} />

          <h3
            className="text-xl sm:text-2xl tracking-[0.15em] uppercase mb-3 text-emboss"
            style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b8" }}
          >
            Oração Inicial
          </h3>

          <p
            className="text-xs tracking-[0.25em] uppercase mb-8"
            style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b840" }}
          >
            Para todos os dias do estudo
          </p>

          <div className="silver-line mx-auto mb-8" style={{ maxWidth: "120px" }} />

          <h4
            className="text-lg sm:text-xl tracking-[0.1em] uppercase mb-6"
            style={{ fontFamily: "'Cinzel', serif", color: "#c9822a90" }}
          >
            Veni Creator Spiritus
          </h4>

          <p
            className="text-base leading-relaxed max-w-xl mx-auto"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              color: "#b8b8b880",
              lineHeight: 2,
            }}
          >
            Vinde, Espírito Criador, visitai as almas dos vossos fiéis,
            enchei de graça celestial os corações que criastes.
          </p>

          {showFull && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.5 }}
              className="mt-6 space-y-4"
            >
              {[
                "Vós sois chamado o Consolador, dom do Deus Altíssimo, fonte viva, fogo, caridade e unção espiritual.",
                "Sois o dedo da mão de Deus, promessa do Pai, que enriqueceis com sete dons as nossas almas.",
                "Acendei a luz nos nossos sentidos, infundi o amor nos nossos corações, sustentai com vossa força a fraqueza do nosso corpo.",
                "Afastai de nós o inimigo, dai-nos prontamente a paz, sede o nosso guia e evitaremos todo o mal.",
                "Fazei-nos conhecer o Pai, revelai-nos o Filho e em Vós, Espírito de ambos, creiamos em todo o tempo.",
                "Glória a Deus Pai, ao Filho que ressuscitou dos mortos, e ao Espírito Consolador, por todos os séculos dos séculos. Amém.",
              ].map((verse, i) => (
                <p
                  key={i}
                  className="text-base leading-relaxed max-w-xl mx-auto"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                    color: "#b8b8b870",
                    lineHeight: 1.9,
                  }}
                >
                  {verse}
                </p>
              ))}
            </motion.div>
          )}

          <button
            onClick={() => setShowFull(!showFull)}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2 transition-all duration-300 hover:bg-white/[0.03]"
            style={{
              border: "1px solid #b8b8b815",
              fontFamily: "'Cinzel', serif",
              fontSize: "11px",
              letterSpacing: "0.15em",
              textTransform: "uppercase" as const,
              color: "#b8b8b860",
            }}
          >
            {showFull ? "Recolher" : "Ler oração completa"}
            <ChevronRight
              size={14}
              style={{
                transform: showFull ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.3s",
              }}
            />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   STUDY TIPS SECTION
   ═══════════════════════════════════════════════════ */
function StudyTipsSection() {
  const { ref, visible } = useInView(0.15);

  const dicasEstudo = [
    "Defina metas claras",
    "Crie um cronograma",
    "Organize seus materiais",
    "Pratique a disciplina",
    "Busque ajuda quando necessário",
    "Revisar e refletir sobre o que aprendeu",
    "Aplique o conhecimento na vida prática",
  ];

  const dicasOracao = [
    "Encontre um local tranquilo",
    "Reze com fé e sinceridade",
    "Peça orientação específica",
    "Agradeça pelas bênçãos",
    "Mantenha a oração como hábito diário",
  ];

  return (
    <section
      ref={ref}
      className="relative py-20"
      style={{ background: "linear-gradient(to bottom, #0d0b09, #12100d, #0d0b09)" }}
    >
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h3
            className="text-xl sm:text-2xl tracking-[0.12em] uppercase text-emboss mb-2"
            style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b8" }}
          >
            Dicas para a Jornada
          </h3>
          <p
            className="text-xs tracking-[0.2em] uppercase"
            style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b840" }}
          >
            Família JUF
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Dicas de Estudo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-6 sm:p-8"
            style={{
              background: "rgba(201,130,42,0.04)",
              border: "1px solid rgba(201,130,42,0.12)",
            }}
          >
            <div className="flex items-center gap-3 mb-5">
              <BookOpen size={18} style={{ color: "#c9822a80" }} />
              <h4
                className="text-sm tracking-[0.15em] uppercase"
                style={{ fontFamily: "'Cinzel', serif", color: "#c9822a" }}
              >
                Estudo Eficaz
              </h4>
            </div>
            <div className="space-y-3">
              {dicasEstudo.map((d, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span
                    className="text-xs mt-1 shrink-0"
                    style={{ color: "#c9822a60", fontFamily: "'Cinzel', serif" }}
                  >
                    {i + 1}.
                  </span>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#b8b8b890", fontFamily: "'Source Sans 3', sans-serif" }}
                  >
                    {d}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Dicas de Oração */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="p-6 sm:p-8"
            style={{
              background: "rgba(184,184,184,0.03)",
              border: "1px solid rgba(184,184,184,0.08)",
            }}
          >
            <div className="flex items-center gap-3 mb-5">
              <Handshake size={18} style={{ color: "#b8b8b860" }} />
              <h4
                className="text-sm tracking-[0.15em] uppercase"
                style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b8" }}
              >
                Oração Eficaz
              </h4>
            </div>
            <div className="space-y-3">
              {dicasOracao.map((d, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span
                    className="text-xs mt-1 shrink-0"
                    style={{ color: "#b8b8b850", fontFamily: "'Cinzel', serif" }}
                  >
                    {i + 1}.
                  </span>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#b8b8b890", fontFamily: "'Source Sans 3', sans-serif" }}
                  >
                    {d}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* HERE TO SERVE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-14"
        >
          <div className="amber-line mx-auto mb-8" style={{ maxWidth: "100px" }} />
          <p
            className="text-sm tracking-[0.25em] uppercase mb-4"
            style={{ fontFamily: "'Cinzel', serif", color: "#c9822a70" }}
          >
            Here to Serve
          </p>
          <p
            className="text-base max-w-lg mx-auto leading-relaxed"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              color: "#b8b8b870",
              lineHeight: 1.8,
            }}
          >
            "{INTRO.hereToServe}"
          </p>
          <p
            className="text-xs mt-3 tracking-[0.1em] uppercase"
            style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b840" }}
          >
            — {INTRO.hereToServeRef}
          </p>
          <div className="silver-line mx-auto mt-8" style={{ maxWidth: "80px" }} />
          <p
            className="text-xs mt-6 tracking-[0.2em] uppercase"
            style={{ fontFamily: "'Cinzel', serif", color: "#c9822a40" }}
          >
            Pax et Ignis
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════ */
function StudyFooter() {
  return (
    <footer className="relative py-16 text-center" style={{ background: "#0d0b09" }}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="silver-line mx-auto mb-8" style={{ maxWidth: "100px" }} />

        <div
          className="w-14 h-14 mx-auto mb-5 rounded-full overflow-hidden"
          style={{ border: "1px solid #b8b8b815" }}
        >
          <img src={IMG.sinal} alt="DOMUS" className="w-full h-full object-cover" />
        </div>

        <p
          className="text-sm tracking-[0.2em] uppercase mb-2"
          style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b850" }}
        >
          Domus · Estudos
        </p>

        <p
          className="text-xs tracking-[0.15em] uppercase mb-6"
          style={{ fontFamily: "'Cinzel', serif", color: "#c9822a40" }}
        >
          Família JUF · Editora Tocha
        </p>

        <p
          className="text-sm max-w-md mx-auto"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: "#b8b8b840",
          }}
        >
          {INTRO.closing}
        </p>

        <div className="silver-line mx-auto mt-8" style={{ maxWidth: "60px" }} />
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════ */
export default function Estudos() {
  const [activeWeek, setActiveWeek] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { toggleDay, isDayCompleted, getWeekProgress, getTotalProgress } = useProgress();
  const { addEntry: addDiaryEntry } = useDiary();
  const { isAuthorized } = useAuthorization();
  const [, navigate] = useLocation();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // TODOS os hooks devem estar ANTES de qualquer return condicional
  const totalProg = getTotalProgress(WEEKS.map((w) => w.days.length));

  useEffect(() => {
    try {
      const stored = localStorage.getItem('domus_user');
      if (stored) {
        const user = JSON.parse(stored);
        setUserEmail(user.email || null);
      } else {
        setUserEmail(null);
      }
    } catch {
      setUserEmail(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const h = () => {
      const top = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(height > 0 ? top / height : 0);
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const mobileLinks = [
    { label: "Início", href: "/" },
    { label: "Pilares", href: "/#pilares" },
    { label: "Oração", href: "/#oracao" },
    { label: "Estudos", href: "/estudos", highlight: true },
    { label: "Diário", href: "/diario" },
    { label: "Comunidade", href: "/comunidade" },
    { label: "Músicas", href: "/musicas" },
    { label: "Sobre", href: "/sobre" },
  ];

  // Mostrar loading enquanto verifica autorização
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0d0b09" }}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: "#c9822a", borderTopColor: "transparent" }} />
          <p style={{ color: "#b8b8b8" }}>Verificando acesso...</p>
        </div>
      </div>
    );
  }

  // Bloquear se NÃO está logado — formulário de login inline
  if (!userEmail) {
    return (
      <div className="relative min-h-screen" style={{ background: "#0d0b09" }}>
        <MobileMenu links={mobileLinks} />
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-md w-full">
            <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: "rgba(201,130,42,0.15)", border: "2px solid rgba(201,130,42,0.3)" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c9822a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <h1 className="text-4xl font-bold mb-4" style={{ color: "#c9822a", fontFamily: "'Cinzel', serif" }}>
              Login Necessário
            </h1>
            <p className="text-lg mb-6" style={{ color: "#b8b8b8", fontFamily: "'Cormorant Garamond', serif" }}>
              Para acessar os Estudos, faça login abaixo.
            </p>
            <form
              className="flex flex-col gap-4 text-left"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const name = (form.elements.namedItem('loginName') as HTMLInputElement).value.trim();
                const email = (form.elements.namedItem('loginEmail') as HTMLInputElement).value.trim().toLowerCase();
                if (name && email) {
                  localStorage.setItem('domus_user', JSON.stringify({ name, email }));
                  setUserEmail(email);
                }
              }}
            >
              <div>
                <label className="block text-sm mb-1" style={{ color: "#b8b8b8" }}>Nome</label>
                <input
                  name="loginName"
                  type="text"
                  required
                  placeholder="Seu nome completo"
                  className="w-full px-4 py-3 rounded text-sm outline-none transition"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,130,42,0.3)", color: "#e8e8e8" }}
                />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: "#b8b8b8" }}>Email</label>
                <input
                  name="loginEmail"
                  type="email"
                  required
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 rounded text-sm outline-none transition"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,130,42,0.3)", color: "#e8e8e8" }}
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 rounded font-semibold transition hover:opacity-90 mt-2"
                style={{ background: "#c9822a", color: "#0d0b09", fontFamily: "'Cinzel', serif" }}
              >
                Entrar
              </button>
            </form>
            <div className="mt-6">
              <button
                onClick={() => navigate('/solicitar-acesso')}
                className="px-6 py-3 rounded font-semibold transition hover:opacity-90 w-full"
                style={{ background: "transparent", color: "#c9822a", border: "1px solid rgba(201,130,42,0.4)" }}
              >
                Solicitar Acesso
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Bloquear se está logado mas NÃO autorizado
  if (!isAuthorized(userEmail)) {
    return (
      <div className="relative min-h-screen" style={{ background: "#0d0b09" }}>
        <MobileMenu links={mobileLinks} />
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: "rgba(201,130,42,0.15)", border: "2px solid rgba(201,130,42,0.3)" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c9822a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h1 className="text-4xl font-bold mb-4" style={{ color: "#c9822a", fontFamily: "'Cinzel', serif" }}>
              Acesso Restrito
            </h1>
            <p className="text-lg mb-4" style={{ color: "#b8b8b8", fontFamily: "'Cormorant Garamond', serif" }}>
              Os Estudos estão disponíveis apenas para usuários autorizados.
            </p>
            <p className="text-sm mb-8" style={{ color: "rgba(184,184,184,0.6)" }}>
              Logado como: {userEmail}
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/solicitar-acesso')}
                className="px-6 py-3 rounded font-semibold transition hover:opacity-90"
                style={{ background: "#c9822a", color: "#0d0b09" }}
              >
                Solicitar Acesso
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 rounded font-semibold transition hover:opacity-90"
                style={{ background: "transparent", color: "#b8b8b8", border: "1px solid rgba(184,184,184,0.2)" }}
              >
                Voltar ao Início
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen" style={{ background: "#0d0b09" }}>
      {/* Scroll progress */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[2px]">
        <div
          className="h-full transition-all duration-150"
          style={{
            width: `${scrollProgress * 100}%`,
            background: `linear-gradient(90deg, #b8b8b840, ${WEEKS[activeWeek].color}, ${WEEKS[activeWeek].color}, #b8b8b840)`,
          }}
        />
      </div>

      {/* Total progress floating badge */}
      {totalProg.completed > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3"
          style={{
            background: "rgba(13,11,9,0.95)",
            border: "1px solid #c9822a30",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="relative w-10 h-10">
            <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#b8b8b815"
                strokeWidth="2.5"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#c9822a"
                strokeWidth="2.5"
                strokeDasharray={`${totalProg.percent}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <span
              className="absolute inset-0 flex items-center justify-center text-[10px]"
              style={{ fontFamily: "'Cinzel', serif", color: "#c9822a" }}
            >
              {Math.round(totalProg.percent)}%
            </span>
          </div>
          <div>
            <p
              className="text-[10px] tracking-[0.15em] uppercase"
              style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b860" }}
            >
              Jornada
            </p>
            <p
              className="text-xs"
              style={{ fontFamily: "'Cinzel', serif", color: "#c9822a" }}
            >
              {totalProg.completed}/{totalProg.total} dias
            </p>
          </div>
        </motion.div>
      )}

      <StudyNav />
      <StudyHero />
      <VeniCreatorSection />
      <StudyTipsSection />
      <WeekSelector activeWeek={activeWeek} setActiveWeek={setActiveWeek} />
      <WeekContent
        activeWeek={activeWeek}
        isDayCompleted={isDayCompleted}
        toggleDay={toggleDay}
        getWeekProgress={getWeekProgress}
        addDiaryEntry={addDiaryEntry}
      />
      <StudyFooter />
    </div>
  );
}
