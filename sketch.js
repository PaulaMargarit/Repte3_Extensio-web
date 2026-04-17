//Variable tipografia
let fontText;
//Angle de rotació inicial
let angle= 0;

//Velocitat de gir
let speed = 0.02;

//Indiquem si el cronòmetre està en marxa
let actiu = false;
//Temps inicial
let iniciTemps = 0;
//Temps transcorregut
let tempsTranscorregut = 0;

//Paleta de colors
let paleta=[
  [235, 244, 249],
  [93, 166, 208],
  [47, 120, 162],
  [26, 67, 91], 
];

//Variables botons
let botoInici, botoPausa, botoReinici;

//Comptador inici
let comptadorHores =0;

function preload(){
  //Importem tipografia
  fontText = loadFont('data/Caprasimo-Regular.ttf');
}

function setup(){
  //Mida del canvas
  createCanvas(300, 150);
  //Canviem la mesura a graus
  angleMode(DEGREES);
  
  //Fem servir getItem per recuperar informació 
  //Recuperem les hores comptades
  comptadorHores = getItem("comptadorHores");
  //Si no hi ha valor posa 0
  if(comptadorHores ==null){
    comptadorHores=0;
  }
  //Recuperem el temps transcorregut
  tempsTranscorregut = getItem("tempsTranscorregut");
  if(tempsTranscorregut ==null){
    tempsTranscorregut=0;
  }
  //Recuperem l'angle
  angle = getItem("angle");
  //Si no hi ha valor posa 0
  if(angle ==null){
    angle=0;
  }
  //Recuperem l'estat actiu o no actiu
  actiu = getItem("actiu");
  //Si no hi ha valor posa false
  if(actiu ==null){
    actiu=false;
  }

  //Que passa quan tanquem l'extensió
  //Si estava actiu, continua on estava
  if (actiu){
    //Reconstruïm el punt d'inici perquè el cronòmetre continuï exactament des del temps guardat
    iniciTemps = millis() - tempsTranscorregut;
  }else{
    //Si estava en pausa o reiniciat
    //L'inici del temps és el mateix
    iniciTemps = millis();
  }
  
  //Creem botó per iniciar o continuar el gir i el comptador
  botoInici = createButton('▶');
  //Posició del botó
  botoInici.position(170,40);
  //Connectem el botó amb el css
  botoInici.id('botoInici');
  //Quan cliquem el botó
  botoInici.mousePressed(function(){
    //Si no està actiu (en pausa) i el temps transcorregut és major de 0 i menor de 3600000ms (1h), vol dir que s'ha pausat i volem continuar on ho havíem deixat
    if (!actiu && tempsTranscorregut > 0 && tempsTranscorregut < 3600000){
      //Continua després de la pausa on estava
      repren();
    } else {
      //Si no està en pausa o ja s'ha completat l'hora, comença de nou
      inicia();
    }
    //Desem l'estat actual
    storeItem("actiu", actiu);
    //Desem el temps transcorregut actualitzat
    storeItem("tempsTranscorregut", tempsTranscorregut);
    //Desem l'angle actualitzat
    storeItem("angle", angle);
  });
  
  //Creem botó de pausa
  botoPausa = createButton('❚❚');
  //Posició del botó
  botoPausa.position(230,40);
  //Connectem el botó amb el css
  botoPausa.id('botoPausa');
  //Quan cliquem el botó
  botoPausa.mousePressed(function(){
    //Canvia l'estat d'actiu a no actiu(pausa)
    actiu = false;
    //Desem l'estat 
    storeItem("actiu", actiu);
  });
  
  //Creem botó de reinici
  botoReinici = createButton('Reiniciar');
  //Posició del botó
  botoReinici.position(170,90);
  //Connectem el botó amb el css
  botoReinici.id('botoReinici');
  //Quan cliquem el botó
  botoReinici.mousePressed(function(){
    //Reiniciem variables
    //Comptador a 0
    comptadorHores = 0;
    //Temps a 0
    tempsTranscorregut = 0;
    //Angle a 0
    angle = 0;
    //Estat no actiu
    actiu = false;
    //Temps en mil·lisegons
    iniciTemps = millis();
    
    //Desem valora reiniciats
    //Desem el número del comptador
    storeItem("comptadorHores", comptadorHores);
    //Desem temps 
    storeItem("tempsTranscorregut", tempsTranscorregut);
    //Desem l'angle
    storeItem("angle", angle);
    //Desem l'estat
    storeItem("actiu", actiu);
  });
}

function draw(){
  //Color gris de fons
  background(220);
  
  //Si està actiu (play)
  if(actiu){
    //Calculem el temps actual amb la diferència entre ara i l'inici
    tempsTranscorregut = millis() - iniciTemps;
    //Desem el temps
    storeItem("tempsTranscorregut", tempsTranscorregut);
    //Desem l'estat
    storeItem("actiu", actiu);
    
    //Si ha passat més d'una hora
    //1 hora = 3.600.000 ms
    if (tempsTranscorregut >= 3600000) {       //Sumem +1 al comptador
      comptadorHores = comptadorHores +1;
      //Desem el número del comptador
      storeItem("comptadorHores", comptadorHores);
      //Aturem
      actiu = false;
      //Desem l'estat  
      storeItem("actiu", actiu);
      //Posem el temps a 0
      tempsTranscorregut = 0;
      //Desem el temps
      storeItem("tempsTranscorregut", tempsTranscorregut);
    }
  }
  
  // Convertim el temps transcorregut a minuts i segons
  let totalSegons = floor(tempsTranscorregut / 1000); //(de ms a segons)
  let m = floor(totalSegons / 60); // (de segons a minuts)
  
  //Vinil
  //Iniciem el grup de dibuix. Guarda estat actual del canvas
  push();
  //Paleta de colors per l'hora
  let quarts=floor(m / 15); //(cada 15 minuts canvia de color)
  //Limitem valor màxim de colors
  quarts = constrain(quarts, 0, paleta.length - 1);
  //Agafem els colors de la paleta cada quart
  let colorActual = paleta[quarts];
  //Colors
  fill(colorActual[0], colorActual[1], colorActual[2]);

  //Movem l'origen de coordenades al centre del vinil
  translate(75, 75);
  //Rotem el vinil
  rotate(angle);
  //Les el·lipses es dibuixen des del centre
  ellipseMode(CENTER);
  
  //Control moviment de gir
  if (actiu){
    //Augment de velocitat per minuts
    let velocitat = speed + m * 0.5;
    angle += velocitat;
    //Desem l'angle
    storeItem("angle", angle);
  }
  
  //Cridem a la funció vinil per dibuixar-lo
  vinil(0, 0, 120);
  pop();
  
  //Font text
  textFont(fontText);
  //Mida lletra
  textSize(11);
  //Color lletra
  fill(0);
  //Text comptador 
  text('Hores completades ' + comptadorHores, 170, 25);
  
  //Cercles que aguanten el braç
  //Sense color interior
  noFill();
  ellipse(144,25,10,10);
  ellipse(144,25,20,20);
  
  //Braç agulla vinil
  //Iniciem el grup de dibuix. Guarda estat actual del canvas
  push();
  //Gruix de la línia
  strokeWeight(3);
  //Dibuixem el braç de l'agulla
  line(150,10,120,90);
  pop();
  
  //Color gris per l'agulla
  fill(211, 211, 211);
  //Arrodonim els vèrtexs del quadrat
  strokeJoin(ROUND);
  //Dibuixem un rectangle
  quad(115,85, 125, 95, 110, 110, 100, 100);
  
  //Detall
  fill(140);
  ellipse(15,135,10,10);
}


function vinil(posX, posY, diamVinil){
  
  //Cercle vinil
  ellipse(posX, posY, diamVinil, diamVinil);
  
  //Color beix pel cercle més petit, color constant
  fill(245);
  ellipse(posX, posY, diamVinil*0.4, diamVinil*0.4)
  
  //Forat del centre
  //Color negre
  fill(0);
  ellipse(posX, posY, diamVinil*0.02, diamVinil*0.02);
  
  //Arcs dins del vinil
  //Gruix de les línies 
  strokeWeight(2);
  //Sense color, perquè només es vegin els arcs
  noFill();
  //Arc interior 
  arc(posX, posY,  (diamVinil)-20, (diamVinil)-20, 0, 60);
  //Arc que va des de l'angle 10 a 50, per crear un arc interior proporcional més petit
  arc(posX, posY,  (diamVinil)-40, (diamVinil)-40, 10, 50);
}

//Funció per començar de zero (play)
function inicia(){
  //Cronòmetre funciona
  actiu = true;
  //Guardem el moment exacte en què comença
  iniciTemps = millis();
  //Angle a 0
  angle = 0;
  //Temps a 0
  tempsTranscorregut=0;
}

//Funció per continuar una pausa o reiniciar
function repren(){
  //Cronòmetre funciona
  actiu = true;
    // Reconstruïm el punt d'inici perquè el cronòmetre continuï exactament des del temps guardat abans de pausar o tancar
  iniciTemps = millis() - tempsTranscorregut;
}