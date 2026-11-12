/* =========================================================================
 * Vocabulário técnico da busca mundial (carregado antes do app.js)
 *
 * 1. EXPRESSOES_PT_EN  – expressões de várias palavras (lidas antes das palavras soltas)
 * 2. DICIONARIO_PT_EN  – palavras soltas em português (sem acento, no singular)
 * 3. NIVEL_TERMO_EN    – prioridade de cada termo em inglês na consulta
 *                        (3 = assunto central, 2 = peça/forma, 1 = comum, 0 = genérico)
 * 4. EQUIVALENTES_EN   – sinônimos aceitos ao medir a relevância de um resultado
 * 5. REGRAS_CIP        – regras da classe CIP sugerida, por área técnica
 * ========================================================================= */

const EXPRESSOES_PT_EN = {
    'sem fio': ['wireless'], 'internet das coisas': ['iot'], 'tempo real': [],
    'impressora 3d': ['3d', 'printer'], 'impressao 3d': ['3d', 'printing'], 'impresso em 3d': ['3d', 'printed'],
    'manufatura aditiva': ['additive', 'manufacturing'],
    'energia solar': ['solar', 'energy'], 'painel solar': ['solar', 'panel'], 'placa solar': ['solar', 'panel'],
    'energia eolica': ['wind', 'turbine'], 'turbina eolica': ['wind', 'turbine'], 'rede eletrica': ['power', 'grid'],
    'medidor de energia': ['energy', 'meter'], 'consumo de energia': ['energy', 'consumption'],
    'carregador sem fio': ['wireless', 'charging'], 'carro eletrico': ['electric', 'vehicle'], 'veiculo eletrico': ['electric', 'vehicle'],
    'frequencia cardiaca': ['heart', 'rate'], 'batimento cardiaco': ['heart', 'rate'], 'batimentos cardiacos': ['heart', 'rate'],
    'pressao arterial': ['blood', 'pressure'], 'sinais vitais': ['vital', 'signs'], 'oximetro de pulso': ['oximeter'],
    'bomba de insulina': ['insulin', 'pump'], 'aparelho auditivo': ['hearing', 'aid'], 'cadeira de rodas': ['wheelchair'],
    'deficiente visual': ['blind'], 'deficiencia visual': ['blind'], 'pessoa cega': ['blind'], 'linguagem de sinais': ['sign', 'language'],
    'umidade do solo': ['soil', 'moisture'], 'qualidade do ar': ['air', 'quality'], 'qualidade da agua': ['water', 'quality'],
    'nivel de agua': ['water', 'level'], 'caixa d agua': ['water', 'tank'], 'caixa dagua': ['water', 'tank'],
    'vazamento de gas': ['gas', 'leak'], 'vazamento de agua': ['water', 'leak'], 'detector de fumaca': ['smoke', 'detector'],
    'detector de metais': ['metal', 'detector'], 'sensor de presenca': ['occupancy'], 'sensor de movimento': ['motion'],
    'camera termica': ['thermal', 'camera'], 'raio x': ['xray'], 'celula de carga': ['load', 'cell'],
    'visao computacional': ['computer', 'vision'], 'inteligencia artificial': ['artificial', 'intelligence'],
    'aprendizado de maquina': ['machine', 'learning'], 'rede neural': ['neural', 'network'],
    'reconhecimento facial': ['face', 'recognition'], 'impressao digital': ['fingerprint'], 'leitor biometrico': ['biometric'],
    'casa inteligente': ['smart', 'home'], 'cidade inteligente': ['smart', 'city'],
    'carro autonomo': ['autonomous', 'vehicle'], 'veiculo autonomo': ['autonomous', 'vehicle'],
    'braco robotico': ['robotic', 'arm'], 'mao robotica': ['robotic', 'hand'], 'robo aspirador': ['robotic', 'vacuum'],
    'aspirador de po': ['vacuum', 'cleaner'], 'estacao meteorologica': ['weather', 'station'],
    'controle remoto': ['remote', 'control'], 'linha de producao': ['production', 'line'],
    'manutencao preditiva': ['predictive', 'maintenance'], 'codigo de barras': ['barcode'], 'qr code': ['qr'],
    'realidade aumentada': ['augmented', 'reality'], 'realidade virtual': ['virtual', 'reality'],
    'relogio inteligente': ['smartwatch'], 'oculos inteligente': ['smart', 'glasses'],
    'lixeira inteligente': ['waste', 'bin'], 'vaga de estacionamento': ['parking', 'space'],
    'alimentador automatico': ['feeder'], 'bomba de agua': ['water', 'pump'], 'motor de passo': ['stepper', 'motor'],
    'controle de acesso': ['access', 'control'], 'ar condicionado': ['air', 'conditioning'],
    'maquina de lavar': ['washing', 'machine'], 'escova de dente': ['toothbrush'], 'alto falante': ['speaker'],
    'maquina de venda': ['vending'], 'venda automatica': ['vending'], 'caixa de som': ['speaker'],
    'gado leiteiro': ['dairy', 'cattle'], 'sala de aula': ['classroom']
};

const DICIONARIO_PT_EN = {
    // Saúde e assistência
    queda: 'fall', idoso: 'elderly', idosa: 'elderly', cuidador: 'caregiver', cuidadora: 'caregiver', paciente: 'patient',
    hospital: 'hospital', hospitalar: 'hospital', enfermagem: 'nursing', medicamento: 'medication', remedio: 'medication',
    comprimido: 'pill', dosador: 'dispenser', dispensador: 'dispenser', insulina: 'insulin', glicose: 'glucose',
    glicemia: 'glucose', diabetes: 'diabetes', diabetico: 'diabetes', cardiaco: 'heart', cardiaca: 'heart', coracao: 'heart',
    batimento: 'heart', eletrocardiograma: 'ecg', oximetro: 'oximeter', oximetria: 'oximeter', oxigenio: 'oxygen',
    saturacao: 'spo2', fotopletismografia: 'photoplethysmography', respiracao: 'respiration', respiratorio: 'respiratory',
    apneia: 'apnea', sono: 'sleep', ronco: 'snoring', postura: 'posture', coluna: 'spine', fisioterapia: 'rehabilitation',
    reabilitacao: 'rehabilitation', protese: 'prosthesis', ortese: 'orthosis', exoesqueleto: 'exoskeleton', muscular: 'muscle',
    musculo: 'muscle', eletromiografia: 'emg', cerebral: 'brain', cerebro: 'brain', convulsao: 'seizure', epilepsia: 'epilepsy',
    febre: 'fever', termometro: 'thermometer', estetoscopio: 'stethoscope', auditivo: 'hearing', audicao: 'hearing',
    surdo: 'deaf', surdez: 'deaf', cego: 'blind', cega: 'blind', cegueira: 'blind', bebe: 'baby', neonatal: 'neonatal',
    incubadora: 'incubator', gestante: 'pregnancy', gravidez: 'pregnancy', saude: 'health', medico: 'medical',
    medica: 'medical', clinico: 'clinical', vital: 'vital', emergencia: 'emergency', socorro: 'emergency', panico: 'panic',
    ambulancia: 'ambulance', mascara: 'mask', alcool: 'alcohol', bafometro: 'breathalyzer', higienizacao: 'sanitizing',
    desinfeccao: 'disinfection', ultravioleta: 'ultraviolet', acessibilidade: 'accessibility', deficiente: 'disabled',
    deficiencia: 'disability', autismo: 'autism', braille: 'braille', libras: 'sign', bengala: 'cane',
    // Agro, animais e meio ambiente
    irrigacao: 'irrigation', irrigar: 'irrigation', irrigador: 'irrigation', solo: 'soil', terra: 'soil', umidade: 'humidity',
    plantacao: 'crop', lavoura: 'crop', cultivo: 'cultivation', planta: 'plant', horta: 'garden', jardim: 'garden',
    estufa: 'greenhouse', hidroponia: 'hydroponic', hidroponico: 'hydroponic', fertilizante: 'fertilizer', adubo: 'fertilizer',
    adubacao: 'fertilization', pulverizacao: 'spraying', pulverizador: 'sprayer', praga: 'pest', inseto: 'insect',
    colheita: 'harvest', semente: 'seed', plantio: 'planting', fazenda: 'farm', agricola: 'agricultural',
    agricultura: 'agriculture', agro: 'agriculture', pecuaria: 'livestock', gado: 'cattle', boi: 'cattle', vaca: 'cow',
    bovino: 'cattle', ovino: 'sheep', caprino: 'goat', suino: 'pig', porco: 'pig', galinha: 'chicken', frango: 'poultry',
    aviario: 'poultry', ovo: 'egg', chocadeira: 'incubator', leite: 'milk', ordenha: 'milking', colmeia: 'beehive',
    abelha: 'bee', apicultura: 'beekeeping', peixe: 'fish', aquario: 'aquarium', piscicultura: 'aquaculture',
    aquicultura: 'aquaculture', racao: 'feed', alimentador: 'feeder', bebedouro: 'drinker', pastagem: 'pasture', silo: 'silo',
    grao: 'grain', cafe: 'coffee', cana: 'sugarcane', soja: 'soybean', milho: 'corn', chuva: 'rain', pluviometro: 'rain',
    meteorologico: 'weather', meteorologica: 'weather', clima: 'climate', vento: 'wind', anemometro: 'anemometer',
    coleira: 'collar', cachorro: 'dog', cao: 'dog', gato: 'cat', pet: 'pet', estimacao: 'pet', animal: 'animal',
    veterinario: 'veterinary', poluicao: 'pollution', ar: 'air', poeira: 'dust', particulado: 'particulate', carbono: 'carbon',
    metano: 'methane', ozonio: 'ozone', ruido: 'noise', barulho: 'noise', sonoro: 'sound', som: 'sound', acustico: 'acoustic',
    agua: 'water', rio: 'river', lago: 'lake', oceano: 'ocean', mar: 'sea', enchente: 'flood', inundacao: 'flood',
    barragem: 'dam', ponte: 'bridge', estrutural: 'structural', concreto: 'concrete', rachadura: 'crack', trinca: 'crack',
    deslizamento: 'landslide', terremoto: 'earthquake', sismico: 'seismic', floresta: 'forest', desmatamento: 'deforestation',
    queimada: 'wildfire', lixo: 'waste', residuo: 'waste', reciclagem: 'recycling', lixeira: 'bin', compostagem: 'compost',
    esgoto: 'sewage', saneamento: 'sanitation', turbidez: 'turbidity', salinidade: 'salinity', condutividade: 'conductivity',
    // Casa, segurança e prédios
    campainha: 'doorbell', porta: 'door', portao: 'gate', janela: 'window', fechadura: 'lock', trava: 'lock', cadeado: 'padlock',
    cofre: 'safe', alarme: 'alarm', sirene: 'siren', intrusao: 'intrusion', invasao: 'intrusion', invasor: 'intruder',
    ladrao: 'burglar', roubo: 'theft', furto: 'theft', vigilancia: 'surveillance', seguranca: 'security', cftv: 'cctv',
    camera: 'camera', presenca: 'presence', movimento: 'motion', fumaca: 'smoke', incendio: 'fire', fogo: 'fire',
    chama: 'flame', gas: 'gas', vazamento: 'leak', residencial: 'home', residencia: 'home', casa: 'home',
    domestico: 'household', domotica: 'home', iluminacao: 'lighting', lampada: 'lamp', luz: 'light', interruptor: 'switch',
    tomada: 'outlet', persiana: 'shutter', cortina: 'curtain', termostato: 'thermostat', aquecedor: 'heater',
    ventilador: 'fan', climatizacao: 'hvac', geladeira: 'refrigerator', refrigerador: 'refrigerator', fogao: 'stove',
    forno: 'oven', eletrodomestico: 'appliance', piscina: 'pool', reservatorio: 'reservoir', tanque: 'tank',
    cisterna: 'cistern', encanamento: 'plumbing', torneira: 'faucet', chuveiro: 'shower', banheiro: 'bathroom',
    cozinha: 'kitchen', condominio: 'condominium', predio: 'building', edificio: 'building', elevador: 'elevator',
    garagem: 'garage', estacionamento: 'parking', vaga: 'parking', visitante: 'visitor', interfone: 'intercom',
    porteiro: 'intercom', encomenda: 'parcel', correspondencia: 'mail', cadeira: 'chair',
    // Energia
    energia: 'energy', eletrica: 'electric', eletrico: 'electric', eletricidade: 'electricity', consumo: 'consumption',
    medidor: 'meter', solar: 'solar', fotovoltaico: 'photovoltaic', fotovoltaica: 'photovoltaic', painel: 'panel',
    eolica: 'wind', turbina: 'turbine', bateria: 'battery', pilha: 'battery', carregador: 'charger', carregamento: 'charging',
    recarga: 'charging', inversor: 'inverter', gerador: 'generator', tensao: 'voltage', voltagem: 'voltage',
    corrente: 'current', potencia: 'power', transformador: 'transformer', disjuntor: 'breaker', nobreak: 'ups',
    // Transporte e logística
    veiculo: 'vehicle', veicular: 'vehicle', carro: 'car', automovel: 'automobile', automotivo: 'automotive',
    moto: 'motorcycle', motocicleta: 'motorcycle', bicicleta: 'bicycle', patinete: 'scooter', onibus: 'bus',
    caminhao: 'truck', frota: 'fleet', trem: 'train', ferrovia: 'railway', aeronave: 'aircraft', aviao: 'aircraft',
    barco: 'boat', embarcacao: 'vessel', navio: 'ship', transito: 'traffic', semaforo: 'traffic', pedestre: 'pedestrian',
    motorista: 'driver', condutor: 'driver', sonolencia: 'drowsiness', cansaco: 'fatigue', fadiga: 'fatigue',
    colisao: 'collision', acidente: 'accident', freio: 'brake', pneu: 'tire', combustivel: 'fuel', autonomo: 'autonomous',
    autonoma: 'autonomous', navegacao: 'navigation', rastreador: 'tracker', rastreadora: 'tracker',
    rastreamento: 'tracking', rastrear: 'tracking', localizador: 'locator', localizacao: 'location', mapa: 'map',
    mapeamento: 'mapping', mapear: 'mapping', rota: 'route', logistica: 'logistics', entrega: 'delivery', carga: 'cargo',
    estoque: 'inventory', armazem: 'warehouse', deposito: 'warehouse', prateleira: 'shelf', empilhadeira: 'forklift',
    esteira: 'conveyor', pacote: 'package', etiqueta: 'label', drone: 'drone', vant: 'uav', quadricoptero: 'quadcopter',
    satelite: 'satellite', foguete: 'rocket', balao: 'balloon',
    // Indústria e fabricação
    industrial: 'industrial', industria: 'industry', fabrica: 'factory', maquina: 'machine', maquinario: 'machinery',
    manutencao: 'maintenance', preditiva: 'predictive', falha: 'fault', defeito: 'defect', vibracao: 'vibration',
    rolamento: 'bearing', engrenagem: 'gear', torno: 'lathe', fresadora: 'milling', solda: 'welding', soldagem: 'welding',
    corte: 'cutting', prensa: 'press', injetora: 'injection', molde: 'mold', plastico: 'plastic', madeira: 'wood',
    tecido: 'textile', textil: 'textile', costura: 'sewing', embalagem: 'packaging', envase: 'filling', garrafa: 'bottle',
    qualidade: 'quality', inspecao: 'inspection', contagem: 'counting', contador: 'counter', peso: 'weight',
    balanca: 'scale', pesagem: 'weighing', nivel: 'level', vazao: 'flow', fluxo: 'flow', pressao: 'pressure',
    temperatura: 'temperature', termico: 'thermal', termica: 'thermal', calor: 'heat', resfriamento: 'cooling',
    refrigeracao: 'refrigeration', aquecimento: 'heating', compressor: 'compressor', bomba: 'pump', valvula: 'valve',
    tubulacao: 'pipe', cano: 'pipe', duto: 'duct', hidraulico: 'hydraulic', hidraulica: 'hydraulic',
    pneumatico: 'pneumatic', atuador: 'actuator', servo: 'servo', motor: 'motor', rele: 'relay', robo: 'robot',
    robotico: 'robotic', robotica: 'robotic', braco: 'arm', garra: 'gripper', manipulador: 'manipulator',
    automacao: 'automation', impressora: 'printer', impressao: 'printing', filamento: 'filament', extrusora: 'extruder',
    extrusao: 'extrusion', bico: 'nozzle', camada: 'layer', resina: 'resin', fatiador: 'slicer', tridimensional: '3d',
    // Peças e grandezas
    acelerometro: 'accelerometer', giroscopio: 'gyroscope', magnetometro: 'magnetometer', inercial: 'inertial',
    ultrassonico: 'ultrasonic', ultrassom: 'ultrasound', infravermelho: 'infrared', termopar: 'thermocouple',
    termistor: 'thermistor', piezoeletrico: 'piezoelectric', extensometro: 'strain', capacitivo: 'capacitive',
    capacitiva: 'capacitive', resistivo: 'resistive', optico: 'optical', optica: 'optical', fotodiodo: 'photodiode',
    lente: 'lens', microfone: 'microphone', display: 'display', tela: 'screen', teclado: 'keypad', botao: 'button',
    antena: 'antenna', laser: 'laser', sensor: 'sensor', sonda: 'probe', eletrodo: 'electrode', transdutor: 'transducer',
    transceptor: 'transceiver', receptor: 'receiver', transmissor: 'transmitter', circuito: 'circuit', processador: 'processor',
    semicondutor: 'semiconductor', giratorio: 'rotating', rotativo: 'rotating', derretido: 'molten', fundido: 'molten',
    // Vestíveis
    pulseira: 'wristband', bracelete: 'bracelet', relogio: 'watch', vestivel: 'wearable', oculos: 'glasses',
    capacete: 'helmet', luva: 'glove', roupa: 'garment', camiseta: 'shirt', calcado: 'shoe', sapato: 'shoe',
    palmilha: 'insole', tenis: 'shoe', colar: 'necklace', anel: 'ring', fone: 'earphone', cinto: 'belt', mochila: 'backpack',
    // Comunicação, software e interação
    voz: 'voice', fala: 'speech', audio: 'audio', imagem: 'image', video: 'video', reconhecimento: 'recognition',
    facial: 'face', rosto: 'face', biometria: 'biometric', biometrico: 'biometric', biometrica: 'biometric', iris: 'iris',
    gesto: 'gesture', traducao: 'translation', tradutor: 'translator', pagamento: 'payment', moeda: 'coin', cartao: 'card',
    internet: 'internet', nuvem: 'cloud', servidor: 'server', aplicativo: 'app', celular: 'smartphone',
    notificacao: 'notification', alerta: 'alert', aviso: 'alert', mensagem: 'message',
    telemetria: 'telemetry', remoto: 'remote', remota: 'remote', inteligente: 'smart', automatico: 'automatic',
    automatica: 'automatic', monitoramento: 'monitoring', monitorar: 'monitoring', controle: 'control',
    deteccao: 'detection', detector: 'detector', portatil: 'portable', radiofrequencia: 'rfid',
    // Educação, lazer e esporte
    educacao: 'education', educacional: 'educational', ensino: 'teaching', aluno: 'student', estudante: 'student',
    escola: 'school', escolar: 'school', biblioteca: 'library', laboratorio: 'laboratory', didatico: 'educational',
    brinquedo: 'toy', jogo: 'game', musica: 'music', musical: 'music', violao: 'guitar', guitarra: 'guitar', piano: 'piano',
    esporte: 'sports', esportivo: 'sports', treino: 'training', corrida: 'running', atleta: 'athlete', natacao: 'swimming',
    futebol: 'soccer', bola: 'ball',
    horario: 'schedule', coleta: 'collection', tutor: 'owner', dono: 'owner', prefeitura: 'municipality'
};

// Siglas e termos que já são iguais em inglês
const SIGLAS_TECNICAS = ['uwb', 'gps', 'gnss', 'ble', 'bluetooth', 'wifi', 'lora', 'lorawan', 'iot', 'pcb', 'esp32', 'esp8266',
    'stm32', 'arduino', 'raspberry', 'lidar', 'radar', 'sonar', 'rfid', 'nfc', 'led', 'mqtt', 'zigbee', 'spo2', 'ecg', 'ppg',
    'eeg', 'emg', 'imu', 'lte', 'nbiot', 'gsm', '4g', '5g', 'sigfox', 'modbus', 'canbus', 'freertos', 'fpga', 'asic', 'mems',
    'oled', 'lcd', 'rgb', 'cnc', 'plc', 'clp', 'ups', 'co2', 'ph', 'uv', 'uav', 'cubesat', '3d', 'qr', 'nfc', 'gprs', 'cctv',
    'hvac', 'smartwatch', 'airtag', 'ar', 'vr'].filter(t => t !== 'ar'); // "ar" (português) = air

// Prioridade de cada termo em inglês. Termos do dicionário fora desta lista = 2 (peça/forma).
const NIVEL_TERMO_EN = (() => {
    const mapa = {};
    const definir = (nivel, lista) => lista.split(/\s+/).filter(Boolean).forEach(t => { mapa[t] = nivel; });
    definir(3, `fall elderly smoke fire flame gas leak flood doorbell intercom lock padlock intrusion intruder burglar theft
        surveillance cctv irrigation soil moisture greenhouse hydroponic livestock cattle cow sheep goat pig poultry chicken
        beehive bee beekeeping aquaculture aquarium fish pest harvest crop collar dog cat pet oximeter spo2 ecg glucose insulin
        diabetes heart sleep apnea snoring posture prosthesis orthosis exoskeleton seizure epilepsy fever blind deaf hearing
        wheelchair baby neonatal incubator pregnancy medication pill dispenser emg eeg breathalyzer drone
        uav quadcopter lidar radar sonar printer printing filament extruder additive parking traffic pedestrian
        drowsiness fatigue collision autonomous bicycle scooter fleet forklift conveyor warehouse inventory robot robotic
        vacuum gripper cnc welding lathe milling bearing predictive waste recycling bin compost sewage pollution dust
        particulate co2 methane ozone noise earthquake seismic landslide wildfire deforestation dam bridge crack turbidity
        salinity ph weather rain anemometer solar photovoltaic wind turbine charger charging inverter thermostat hvac
        refrigerator stove oven washing elevator faucet shower cistern pool braille sign accessibility autism toy guitar
        piano athlete swimming gesture fingerprint biometric face iris speech translator vending satellite rocket cubesat
        balloon tracker locator helmet glove insole cane smartwatch toothbrush feeder milking dairy uwb airtag barcode rfid
        nfc vibration mask disinfection ultraviolet rehabilitation spine respiration respiratory thermometer stethoscope`);
    definir(1, `temperature humidity pressure light lighting water energy power camera video image motor gps location
        health medical security home household safety alarm emergency air quality sound level flow weight battery display
        led wearable wristband watch detector vehicle car electric map mapping tracking navigation voice recognition
        industrial machine maintenance agriculture agricultural farm plant garden animal door window building caregiver
        patient visitor owner schedule collection municipality`);
    definir(0, `sensor wireless iot wifi bluetooth ble lora lorawan zigbee gsm gprs lte 4g 5g nbiot sigfox mqtt internet cloud
        server app smartphone notification alert message telemetry remote smart automatic monitoring control detection
        esp32 esp8266 arduino raspberry stm32 microcontroller network module automation artificial intelligence machine
        learning neural data system device portable pcb freertos`);
    return mapa;
})();

// Sinônimos aceitos ao medir se um resultado fala do mesmo assunto
const EQUIVALENTES_EN = {
    fall: ['fall', 'falls', 'falling'], elderly: ['elderly', 'senior', 'older', 'aged', 'old people', 'geriatric'],
    caregiver: ['caregiver', 'carer', 'nurse', 'guardian'], wristband: ['wristband', 'wrist', 'bracelet', 'wearable'],
    watch: ['watch', 'smartwatch', 'wrist'], smartwatch: ['smartwatch', 'smart watch', 'watch', 'wrist'],
    wearable: ['wearable', 'worn', 'wrist', 'body'], collar: ['collar', 'harness'], pet: ['pet', 'dog', 'cat', 'animal'],
    dog: ['dog', 'canine', 'pet'], cat: ['cat', 'feline', 'pet'], animal: ['animal', 'livestock', 'pet', 'cattle'],
    doorbell: ['doorbell', 'door bell', 'door station', 'door phone'], lock: ['lock', 'locking', 'latch'],
    fire: ['fire', 'flame'], leak: ['leak', 'leakage'], soil: ['soil', 'ground'], humidity: ['humidity', 'moisture'],
    moisture: ['moisture', 'humidity'], irrigation: ['irrigation', 'irrigating', 'watering', 'sprinkler'],
    drone: ['drone', 'uav', 'unmanned aerial', 'quadcopter', 'multicopter', 'multirotor'],
    uav: ['uav', 'drone', 'unmanned aerial'], quadcopter: ['quadcopter', 'drone', 'multirotor', 'uav'],
    printer: ['printer', 'printing', 'additive', 'three dimensional', 'three-dimensional'],
    printing: ['printing', 'printer', 'additive', 'three dimensional'], '3d': ['3d', 'three dimensional', 'three-dimensional'],
    heart: ['heart', 'cardiac', 'pulse'], ecg: ['ecg', 'ekg', 'electrocardiogram', 'electrocardiograph'],
    oximeter: ['oximeter', 'oximetry', 'spo2', 'oxygen saturation'], spo2: ['spo2', 'oxygen saturation', 'oximetry'],
    glucose: ['glucose', 'blood sugar'], vehicle: ['vehicle', 'car', 'automobile', 'automotive'],
    car: ['car', 'vehicle', 'automobile'], tracker: ['tracker', 'tracking', 'locator'],
    tracking: ['tracking', 'tracker', 'locating'], location: ['location', 'positioning', 'position', 'localization'],
    gps: ['gps', 'gnss', 'satellite positioning'], smartphone: ['smartphone', 'mobile', 'phone', 'cellular'],
    wireless: ['wireless', 'radio', 'wifi', 'bluetooth'], camera: ['camera', 'image', 'video', 'imaging'],
    face: ['face', 'facial'], fingerprint: ['fingerprint', 'biometric'], biometric: ['biometric', 'fingerprint'],
    robot: ['robot', 'robotic'], robotic: ['robotic', 'robot'], parking: ['parking'],
    waste: ['waste', 'garbage', 'trash', 'refuse', 'rubbish'], bin: ['bin', 'container', 'receptacle', 'can'],
    blind: ['blind', 'visually impaired', 'visual impairment'], deaf: ['deaf', 'hearing impaired'],
    medication: ['medication', 'medicine', 'drug', 'pill', 'pharmaceutical'], dispenser: ['dispenser', 'dispensing'],
    alarm: ['alarm', 'alert', 'warning'], alert: ['alert', 'alarm', 'warning', 'notification', 'notify'],
    energy: ['energy', 'power'], solar: ['solar', 'photovoltaic'], light: ['light', 'lighting', 'illumination'],
    lighting: ['lighting', 'light', 'illumination', 'luminaire'], temperature: ['temperature', 'thermal'],
    cane: ['cane', 'walking stick'], monitoring: ['monitoring', 'monitor'],
    home: ['home', 'house', 'household', 'residential', 'domestic'], security: ['security', 'surveillance', 'intrusion'],
    surveillance: ['surveillance', 'monitoring', 'cctv', 'security camera'], noise: ['noise', 'sound', 'acoustic'],
    lidar: ['lidar', 'laser radar', 'laser scanner', 'laser rangefinder'], sensor: ['sensor', 'sensing', 'detector'],
    detector: ['detector', 'detecting', 'detection', 'sensor'], patient: ['patient', 'user', 'subject'],
    cattle: ['cattle', 'cow', 'livestock', 'bovine'], crop: ['crop', 'plant', 'field'], greenhouse: ['greenhouse', 'glasshouse'],
    helmet: ['helmet', 'headgear'], glove: ['glove', 'hand'], shoe: ['shoe', 'footwear', 'insole'],
    smoke: ['smoke'], rain: ['rain', 'precipitation', 'rainfall'], weather: ['weather', 'meteorological'],
    charging: ['charging', 'charger'], charger: ['charger', 'charging'], conveyor: ['conveyor', 'belt'],
    autonomous: ['autonomous', 'self driving', 'self-driving', 'driverless'], sleep: ['sleep'],
    filament: ['filament'], extruder: ['extruder', 'extrusion', 'nozzle'], rotating: ['rotating', 'rotary', 'spinning']
};

/* Regras da classe CIP (IPC) sugerida.
 * Cada regra: área, peso, padrões (texto sem acento) e códigos (o primeiro é o principal da área).
 * A pontuação = peso × número de padrões diferentes encontrados. As áreas mais fortes vêm primeiro. */
const REGRAS_CIP = [
    { area: 'queda', peso: 3, padroes: [/\bqueda/, /\bcai(u|r)\b/, /\bfall\b/, /\btombo/],
      codigos: ['G08B 21/04 (Alarmes que respondem à condição de pessoas — ex.: queda de idosos)', 'A61B 5/11 (Medição de movimento do corpo — acelerômetro, quedas, postura)'] },
    { area: 'idosos', peso: 1, padroes: [/idos[oa]/, /\belderly\b/, /cuidador/],
      codigos: ['G08B 21/02 (Alarmes para a segurança de pessoas que precisam de assistência)'] },
    { area: 'sinais vitais', peso: 3, padroes: [/oxim[eé]tr/, /spo2/, /satura[cç]/, /fotopletism/, /\bppg\b/, /frequencia cardiaca/, /batimento/, /cardiac/],
      codigos: ['A61B 5/1455 (Medição de oxigênio no sangue por métodos ópticos — oximetria)', 'A61B 5/024 (Medição de pulso ou frequência cardíaca)'] },
    { area: 'ecg/eeg', peso: 3, padroes: [/\becg\b/, /eletrocardiogra/, /\beeg\b/, /eletroencefalogra/, /\bemg\b/, /eletromiogra/],
      codigos: ['A61B 5/318 (Medição de sinais bioelétricos do coração — ECG)', 'A61B 5/25 (Eletrodos para sinais bioelétricos)'] },
    { area: 'glicose', peso: 3, padroes: [/glicose/, /glicemia/, /diabet/, /insulina/],
      codigos: ['A61B 5/145 (Medição de características químicas do sangue — glicose)', 'A61M 5/172 (Bombas de infusão controladas — insulina)'] },
    { area: 'medicamento', peso: 3, padroes: [/medicamento/, /remedio/, /comprimido/, /dosador/, /dispensador/],
      codigos: ['A61J 7/04 (Dispositivos para lembrar ou dispensar medicamentos no horário)'] },
    { area: 'sono e respiração', peso: 3, padroes: [/\bsono\b/, /apneia/, /ronco/, /respira/],
      codigos: ['A61B 5/08 (Medição da respiração)', 'A61B 5/4806 (Monitoramento do sono)'] },
    { area: 'postura e reabilitação', peso: 3, padroes: [/postura/, /coluna/, /fisioterap/, /reabilita/, /exoesqueleto/, /protese/, /ortese/],
      codigos: ['A61B 5/11 (Medição de movimento do corpo — postura)', 'A61H 1/02 (Aparelhos de reabilitação e exercício)', 'A61F 2/68 (Próteses acionadas)'] },
    { area: 'acessibilidade', peso: 3, padroes: [/\bceg[oa]s?\b/, /cegueira/, /deficien/, /bengala/, /braille/, /surd/, /libras/, /cadeira de rodas/],
      codigos: ['A61H 3/06 (Auxílios de locomoção para cegos)', 'G09B 21/00 (Auxílios de ensino e comunicação para cegos e surdos)', 'A61G 5/04 (Cadeiras de rodas motorizadas)'] },
    { area: 'saúde geral', peso: 1, padroes: [/saude/, /medic[oa]/, /paciente/, /hospital/, /vital/, /febre/, /termometro/],
      codigos: ['A61B 5/00 (Medição para fins de diagnóstico — sinais vitais)', 'G16H 40/67 (TIC para operação remota de dispositivos médicos)'] },
    { area: 'fumaça e incêndio', peso: 3, padroes: [/fumaca/, /incendio/, /\bfogo\b/, /chama/, /\bsmoke\b/],
      codigos: ['G08B 17/10 (Alarmes de incêndio acionados por fumaça)', 'G08B 17/00 (Alarmes de incêndio)'] },
    { area: 'gás', peso: 3, padroes: [/\bgas\b/, /\bglp\b/, /metano/, /monoxido/, /\bco2\b/],
      codigos: ['G08B 21/16 (Alarmes de gás combustível)', 'G01N 33/00 (Análise de gases e materiais)'] },
    { area: 'vazamento de água', peso: 2, padroes: [/vazamento/, /inundac/, /enchente/, /alagamento/],
      codigos: ['G01M 3/00 (Detecção de vazamentos)', 'G08B 21/20 (Alarmes de nível de líquido / inundação)'] },
    { area: 'campainha e interfone', peso: 4, padroes: [/campainha/, /interfone/, /porteiro/, /\bvisitante/, /doorbell/],
      codigos: ['H04N 7/186 (Sistemas de vídeo para porta — campainha com câmera)', 'H04M 11/02 (Interfones e sistemas de porta)'] },
    { area: 'fechadura e acesso', peso: 3, padroes: [/fechadura/, /\btrava/, /cadeado/, /controle de acesso/, /catraca/],
      codigos: ['E05B 47/00 (Fechaduras de acionamento elétrico)', 'G07C 9/00 (Controle de entrada e acesso)'] },
    { area: 'biometria', peso: 3, padroes: [/biometr/, /impressao digital/, /reconhecimento facial/, /\bfacial\b/, /\biris\b/],
      codigos: ['G06V 40/12 (Reconhecimento de impressões digitais)', 'G06V 40/16 (Reconhecimento facial)'] },
    { area: 'alarme e vigilância', peso: 2, padroes: [/intrus/, /invas/, /ladrao/, /roubo/, /furto/, /vigilancia/, /\bcftv\b/, /alarme (contra|de) (roubo|intrus|invas)/],
      codigos: ['G08B 13/196 (Detecção de intrusão por imagem — câmeras)', 'G08B 13/00 (Alarmes contra roubo e intrusão)'] },
    { area: 'voz', peso: 2, padroes: [/\bvoz\b/, /comando de voz/, /assistente virtual/, /\bfala\b/],
      codigos: ['G10L 15/22 (Reconhecimento de fala com comandos)'] },
    { area: 'irrigação e solo', peso: 3, padroes: [/irrig/, /\bsolo\b/, /umidade do solo/, /lavoura/, /plantacao/, /horta/],
      codigos: ['A01G 25/16 (Controle automático de irrigação)', 'G01N 33/24 (Análise de solo)'] },
    { area: 'estufa e hidroponia', peso: 3, padroes: [/estufa/, /hidropon/, /cultivo indoor/],
      codigos: ['A01G 9/24 (Controle de clima em estufas)', 'A01G 31/02 (Cultivo hidropônico)'] },
    { area: 'animais', peso: 3, padroes: [/coleira/, /\bpets?\b/, /cachorr/, /\bca(o|es)\b/, /\bgatos?\b/, /\banima(l|is)\b/, /\bgado\b/, /bovino/, /pecuaria/, /\bvacas?\b/],
      codigos: ['A01K 29/00 (Equipamentos para criação de animais — monitoramento)', 'A01K 27/00 (Coleiras e guias)', 'A01K 11/00 (Identificação de animais)'] },
    { area: 'aves, peixes e abelhas', peso: 3, padroes: [/aviario/, /galinha/, /frango/, /chocadeira/, /colmeia/, /abelha/, /aquario/, /piscicult/, /aquicult/],
      codigos: ['A01K 31/00 (Equipamentos para criação de aves)', 'A01K 63/00 (Aquários e criação de peixes)', 'A01K 47/06 (Colmeias com monitoramento)'] },
    { area: 'alimentador', peso: 3, padroes: [/alimentador/, /\bracao\b/, /comedouro/, /bebedouro/],
      codigos: ['A01K 5/02 (Alimentadores automáticos para animais)'] },
    { area: 'rastreamento', peso: 2, padroes: [/rastre/, /localiz/, /\bgps\b/, /\bgnss\b/, /\buwb\b/],
      codigos: ['G01S 19/14 (Receptores de satélite para aplicações específicas — rastreamento)', 'G01S 5/02 (Localização por ondas de rádio)'] },
    { area: 'drone', peso: 4, padroes: [/\bdrone/, /\bvant\b/, /quadricoptero/, /multirrotor/],
      codigos: ['B64U 10/00 (Veículos aéreos não tripulados — drones)', 'G05D 1/10 (Controle de voo de aeronaves)'] },
    { area: 'lidar e veículos autônomos', peso: 4, padroes: [/\blidar\b/, /autonom[oa]/, /direcao assistida/, /\bradar\b/],
      codigos: ['G01S 17/89 (Lidar para mapeamento e imagem)', 'G01S 17/931 (Lidar anticolisão em veículos)'] },
    { area: 'veículos e trânsito', peso: 2, padroes: [/veicul/, /\bcarro/, /automov/, /\bmoto\b/, /motorista/, /sonolencia/, /transito/, /semaforo/, /colisao/],
      codigos: ['B60W 40/08 (Estimativa do estado do motorista)', 'G08G 1/00 (Controle de tráfego de veículos)', 'B60R 25/00 (Antifurto veicular)'] },
    { area: 'estacionamento', peso: 4, padroes: [/estacionamento/, /\bvaga/],
      codigos: ['G08G 1/14 (Indicação de vagas livres de estacionamento)'] },
    { area: 'bicicleta e patinete', peso: 3, padroes: [/bicicleta/, /\bbike\b/, /patinete/],
      codigos: ['B62J 45/00 (Sensores e eletrônica para bicicletas)', 'B62K 11/00 (Patinetes e veículos leves motorizados)'] },
    { area: 'robótica', peso: 3, padroes: [/\brobo/, /robotic/, /braco robotico/, /\bgarra\b/, /manipulador/],
      codigos: ['B25J 9/16 (Controle programado de robôs e manipuladores)', 'G05D 1/02 (Controle de posição de robôs móveis)'] },
    { area: 'impressão 3D', peso: 4, padroes: [/impressora 3d/, /impressao 3d/, /filamento/, /extrus/, /manufatura aditiva/, /fatiador/],
      codigos: ['B29C 64/118 (Manufatura aditiva por extrusão de filamento — FDM)', 'B33Y 30/00 (Aparelhos de manufatura aditiva)'] },
    { area: 'usinagem e CNC', peso: 3, padroes: [/\bcnc\b/, /fresadora/, /\btorno\b/, /\bsolda/, /corte a laser/],
      codigos: ['G05B 19/18 (Controle numérico — CNC)', 'B23K 26/00 (Corte e solda a laser)'] },
    { area: 'manutenção industrial', peso: 3, padroes: [/vibrac/, /rolamento/, /manutencao preditiva/, /\bfalha/, /maquinario/],
      codigos: ['G05B 23/02 (Monitoramento e diagnóstico de falhas em máquinas)', 'G01M 13/045 (Ensaio de rolamentos)'] },
    { area: 'logística e estoque', peso: 3, padroes: [/estoque/, /armazem/, /logistic/, /esteira/, /empilhadeira/, /prateleira/, /\brfid\b/, /etiqueta/],
      codigos: ['G06Q 10/087 (Gestão de estoque)', 'G06K 7/10 (Leitura de etiquetas RFID e códigos)'] },
    { area: 'energia solar', peso: 3, padroes: [/solar/, /fotovolta/, /painel solar/],
      codigos: ['H02S 50/00 (Monitoramento de sistemas fotovoltaicos)', 'H02S 20/32 (Rastreadores solares)'] },
    { area: 'baterias e recarga', peso: 2, padroes: [/carregador/, /carregamento/, /recarga/, /bateria/, /carro eletrico/, /veiculo eletrico/],
      codigos: ['H02J 7/00 (Carregamento de baterias)', 'B60L 53/00 (Recarga de veículos elétricos)'] },
    { area: 'consumo de energia', peso: 3, padroes: [/consumo de energia/, /medidor de energia/, /\bkwh\b/, /consumo eletric/, /rede eletrica/],
      codigos: ['G01R 22/00 (Medidores de energia elétrica)', 'H02J 13/00 (Monitoramento e controle de redes elétricas)'] },
    { area: 'iluminação', peso: 2, padroes: [/iluminac/, /lampada/, /\bluz\b/, /luminaria/],
      codigos: ['H05B 47/10 (Controle de fontes de luz)', 'H05B 45/00 (Circuitos para LEDs)'] },
    { area: 'climatização', peso: 2, padroes: [/termostato/, /ar condicionado/, /climatiza/, /aquecedor/, /ventilador/],
      codigos: ['F24F 11/00 (Controle de ar condicionado e ventilação)', 'G05D 23/19 (Controle de temperatura)'] },
    { area: 'qualidade do ar', peso: 3, padroes: [/qualidade do ar/, /poluic/, /poeira/, /particulad/, /ozonio/],
      codigos: ['G01N 33/0004 (Análise de gases e poluentes do ar)', 'G01N 15/06 (Medição de partículas no ar)'] },
    { area: 'qualidade da água', peso: 3, padroes: [/qualidade da agua/, /turbidez/, /\bph\b/, /salinidade/, /potabil/],
      codigos: ['G01N 33/18 (Análise de água)'] },
    { area: 'nível de reservatório', peso: 3, padroes: [/nivel de agua/, /caixa d ?agua/, /reservatorio/, /cisterna/, /\btanque/],
      codigos: ['G01F 23/00 (Medição de nível de líquidos em tanques)'] },
    { area: 'clima e tempo', peso: 3, padroes: [/meteorolog/, /estacao meteorologica/, /\bchuva/, /pluviometr/, /anemometr/, /\bvento\b/],
      codigos: ['G01W 1/02 (Instrumentos meteorológicos)'] },
    { area: 'estruturas e desastres', peso: 3, padroes: [/estrutural/, /\bponte\b/, /barragem/, /rachadura/, /trinca/, /deslizamento/, /sismic/, /terremoto/],
      codigos: ['G01M 5/00 (Monitoramento da integridade de estruturas)', 'G01V 1/00 (Detecção sísmica)'] },
    { area: 'resíduos', peso: 3, padroes: [/\blixo/, /lixeira/, /residuo/, /recicla/, /compostag/],
      codigos: ['B65F 1/14 (Recipientes de lixo com sensores e equipamentos)', 'B09B 3/00 (Tratamento e reciclagem de resíduos)'] },
    { area: 'casa inteligente', peso: 1, padroes: [/residencia/, /\bcasa\b/, /domestic/, /domotica/, /casa inteligente/, /eletrodomestico/],
      codigos: ['H04L 12/28 (Redes de automação residencial)'] },
    { area: 'educação e brinquedos', peso: 2, padroes: [/educac/, /ensino/, /\baluno/, /escola/, /didatic/, /brinquedo/],
      codigos: ['G09B 5/00 (Aparelhos educacionais eletrônicos)', 'A63H 33/00 (Brinquedos eletrônicos e educativos)'] },
    { area: 'música e esporte', peso: 2, padroes: [/musica/, /musical/, /violao/, /guitarra/, /piano/, /esport/, /atleta/, /treino/, /corrida/],
      codigos: ['G10H 1/00 (Instrumentos musicais eletrônicos)', 'A63B 24/00 (Monitoramento de exercícios físicos)'] },
    { area: 'vestíveis', peso: 1, padroes: [/pulseira/, /relogio/, /vestivel/, /wearable/, /oculos/, /capacete/, /\bluva/, /palmilha/],
      codigos: ['G04G 21/00 (Relógios e vestíveis eletrônicos)', 'A41D 1/00 (Roupas com eletrônica embutida)'] },
    { area: 'visão computacional', peso: 1, padroes: [/visao computacional/, /reconhecimento de imagem/, /processamento de imagem/, /\bcamera/],
      codigos: ['G06T 7/00 (Análise de imagens)', 'G06V 20/00 (Reconhecimento de cenas e objetos)'] },
    { area: 'inteligência artificial', peso: 1, padroes: [/inteligencia artificial/, /aprendizado de maquina/, /machine learning/, /rede neural/],
      codigos: ['G06N 20/00 (Aprendizado de máquina)', 'G06N 3/08 (Treinamento de redes neurais)'] },
    { area: 'pagamento', peso: 3, padroes: [/pagamento/, /\bpix\b/, /maquina de venda/, /venda automatica/, /\bmoeda/],
      codigos: ['G06Q 20/32 (Pagamento por dispositivos móveis)', 'G07F 9/00 (Máquinas de venda automática)'] },
    { area: 'espaço', peso: 4, padroes: [/satelite/, /cubesat/, /foguete/, /\bbalao\b/],
      codigos: ['B64G 1/10 (Satélites artificiais)', 'H04B 7/185 (Comunicação via satélite)'] },
    { area: 'chip', peso: 3, padroes: [/\bchip\b/, /silicio/, /\basic\b/, /\bfpga\b/, /semicondutor/, /verilog/, /\bvhdl\b/],
      codigos: ['H01L 27/02 (Circuitos integrados em silício)'] },
    { area: 'comunicação sem fio', peso: 0.5, padroes: [/\biot\b/, /\blora/, /\bmqtt\b/, /sem fio/, /wireless/, /\bwi ?fi\b/, /bluetooth/, /\bble\b/, /zigbee/, /telemetria/],
      codigos: ['H04W 4/38 (Comunicação sem fio para coleta de dados de sensores — IoT)', 'H04L 67/12 (Protocolos para dispositivos embarcados — M2M)'] },
    { area: 'controle de motores e atuadores', peso: 0.5, padroes: [/\bmotor/, /atuador/, /valvula/, /\bservo/, /\brele\b/],
      codigos: ['G05B 19/042 (Controle por microcontrolador com sensores e atuadores)'] }
];
