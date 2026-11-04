/* =====================================================================
   SchoolBus – Dados iniciais
   ---------------------------------------------------------------------
   Carregados só na PRIMEIRA vez que o sistema abre neste navegador
   (ou quando você clica em "Restaurar dados iniciais").
   Depois disso, tudo fica salvo no localStorage pelo banco-local.js.

   Escolas, rotas, ônibus e motoristas são os do sistema atual.
   Os alunos são EXEMPLOS (nomes e telefones fictícios).
   Códigos de responsável para testar: 676NM8 (Ana), MG6VKF (João), C36LAE (Luiza)
   ===================================================================== */
window.SCHOOLBUS_DADOS_INICIAIS = {
  "escolas": {
    "ex-esc-3": {
      "nome": "CETI Professor José Amável",
      "lat": -5.0655,
      "lng": -42.7735,
      "endereco": "Rua Bento Clarindo Bastos, s/n — São Cristóvão",
      "exemplo": false
    },
    "esc-joca-vieira": {
      "nome": "CETI Professor Joca Vieira",
      "lat": -5.0625,
      "lng": -42.777,
      "endereco": "Rua Pedro Conde, 220 — São Cristóvão",
      "exemplo": false
    }
  },
  "motoristas": {
    "ex-mot-1": {
      "nome": "Isaías",
      "telefone": "86990000101",
      "cnh": "04512783690",
      "situacao": "disponivel",
      "foto": "",
      "exemplo": true
    },
    "ex-mot-2": {
      "nome": "Maria da Cruz",
      "telefone": "86990000102",
      "cnh": "07381926450",
      "situacao": "disponivel",
      "foto": "",
      "exemplo": true
    },
    "ex-mot-3": {
      "nome": "Maycon",
      "telefone": "86990000103",
      "cnh": "02967415380",
      "situacao": "disponivel",
      "foto": "",
      "exemplo": true
    },
    "ex-mot-4": {
      "nome": "Hélio",
      "telefone": "86990000104",
      "cnh": "05128364971",
      "situacao": "ferias",
      "foto": "",
      "exemplo": true
    }
  },
  "onibus": {
    "ex-bus-1": {
      "numero": "SB-01",
      "modelo": "Marcopolo Volare V8L",
      "placa": "OEA4C21",
      "capacidade": 29,
      "situacao": "operacao",
      "motoristaId": "ex-mot-1",
      "cor": "#1F5FD9",
      "exemplo": true
    },
    "ex-bus-2": {
      "numero": "SB-02",
      "modelo": "Mercedes-Benz OF-1519 Escolar",
      "placa": "PIV3B07",
      "capacidade": 44,
      "situacao": "operacao",
      "motoristaId": "ex-mot-2",
      "cor": "#D9452B",
      "exemplo": true
    },
    "ex-bus-3": {
      "numero": "SB-03",
      "modelo": "Volkswagen 15.190 ORE",
      "placa": "QSK8J45",
      "capacidade": 44,
      "situacao": "operacao",
      "motoristaId": "ex-mot-3",
      "cor": "#13915F",
      "exemplo": true
    },
    "ex-bus-4": {
      "numero": "SB-04",
      "modelo": "Agrale MA 8.7 Escolar",
      "placa": "RTE1A90",
      "capacidade": 23,
      "situacao": "manutencao",
      "motoristaId": "ex-mot-4",
      "cor": "#7B4BD6",
      "exemplo": true
    }
  },
  "rotas": {
    "ex-rota-1": {
      "nome": "Morros",
      "onibusId": "ex-bus-1",
      "escolaId": "ex-esc-3",
      "origem": {
        "nome": "Garagem SchoolBus",
        "lat": -5.1012,
        "lng": -42.8092
      },
      "destino": {
        "nome": "CETI Professor José Amável",
        "lat": -5.0655,
        "lng": -42.7735
      },
      "paradas": [
        {
          "id": "n1",
          "nome": "Morros — Rua Domingos de Pádua Rêgo",
          "regiao": "Morros",
          "lat": -5.04,
          "lng": -42.752
        },
        {
          "id": "n2",
          "nome": "Morros — Praça",
          "regiao": "Morros",
          "lat": -5.043,
          "lng": -42.7565
        },
        {
          "id": "n3",
          "nome": "Morros — Entrada do bairro",
          "regiao": "Morros",
          "lat": -5.047,
          "lng": -42.762
        }
      ],
      "saida": "06:00",
      "chegada": "06:50",
      "retornoSaida": "17:20",
      "retornoChegada": "18:10",
      "ativa": true,
      "exemplo": false,
      "atualizadoEm": 1793819543533
    },
    "ex-rota-2": {
      "nome": "Planalto Uruguai",
      "onibusId": "ex-bus-2",
      "escolaId": "ex-esc-3",
      "origem": {
        "nome": "Garagem SchoolBus",
        "lat": -5.1012,
        "lng": -42.8092
      },
      "destino": {
        "nome": "CETI Professor José Amável",
        "lat": -5.0655,
        "lng": -42.7735
      },
      "paradas": [
        {
          "id": "s1",
          "nome": "Planalto Uruguai — Rua Planalto",
          "regiao": "Planalto Uruguai",
          "lat": -5.047,
          "lng": -42.76
        },
        {
          "id": "s2",
          "nome": "Planalto Uruguai — Praça",
          "regiao": "Planalto Uruguai",
          "lat": -5.0505,
          "lng": -42.764
        },
        {
          "id": "s3",
          "nome": "Uruguai — Av. Presidente Kennedy",
          "regiao": "Planalto Uruguai",
          "lat": -5.056,
          "lng": -42.769
        }
      ],
      "saida": "06:05",
      "chegada": "06:50",
      "retornoSaida": "17:20",
      "retornoChegada": "18:05",
      "ativa": true,
      "exemplo": false,
      "atualizadoEm": 1793819543533
    },
    "ex-rota-3": {
      "nome": "BR-343",
      "onibusId": "ex-bus-3",
      "escolaId": "ex-esc-3",
      "origem": {
        "nome": "Garagem SchoolBus",
        "lat": -5.1012,
        "lng": -42.8092
      },
      "destino": {
        "nome": "CETI Professor José Amável",
        "lat": -5.0655,
        "lng": -42.7735
      },
      "paradas": [
        {
          "id": "u1",
          "nome": "Zé de Holanda",
          "regiao": "Zé de Holanda",
          "lat": -5.045,
          "lng": -42.715
        },
        {
          "id": "u2",
          "nome": "BR-343 — Comunidade",
          "regiao": "BR-343",
          "lat": -5.048,
          "lng": -42.728
        },
        {
          "id": "u3",
          "nome": "Pedra Mole — Vila São José",
          "regiao": "Pedra Mole",
          "lat": -5.052,
          "lng": -42.74
        },
        {
          "id": "u4",
          "nome": "BR-343 — Entrada da cidade",
          "regiao": "BR-343",
          "lat": -5.057,
          "lng": -42.755
        }
      ],
      "saida": "05:35",
      "chegada": "06:50",
      "retornoSaida": "17:20",
      "retornoChegada": "18:35",
      "ativa": true,
      "exemplo": false,
      "atualizadoEm": 1793819543533
    },
    "ex-rota-4": {
      "nome": "São Vicente",
      "onibusId": "ex-bus-4",
      "escolaId": "ex-esc-3",
      "origem": {
        "nome": "Garagem SchoolBus",
        "lat": -5.1012,
        "lng": -42.8092
      },
      "destino": {
        "nome": "CETI Professor José Amável",
        "lat": -5.0655,
        "lng": -42.7735
      },
      "paradas": [
        {
          "id": "l1",
          "nome": "São Vicente de Baixo — Rua Tipiti",
          "regiao": "São Vicente de Baixo",
          "lat": -5.082,
          "lng": -42.755
        },
        {
          "id": "l2",
          "nome": "São Vicente de Baixo — Praça",
          "regiao": "São Vicente de Baixo",
          "lat": -5.079,
          "lng": -42.76
        },
        {
          "id": "l3",
          "nome": "São Vicente — Igreja",
          "regiao": "São Vicente",
          "lat": -5.074,
          "lng": -42.766
        }
      ],
      "saida": "06:10",
      "chegada": "06:50",
      "retornoSaida": "17:20",
      "retornoChegada": "18:00",
      "ativa": true,
      "exemplo": false,
      "atualizadoEm": 1793819543533
    },
    "rota-satelite": {
      "nome": "Satélite",
      "onibusId": "ex-bus-2",
      "escolaId": "esc-joca-vieira",
      "origem": {
        "nome": "Garagem SchoolBus",
        "lat": -5.1012,
        "lng": -42.8092
      },
      "destino": {
        "nome": "CETI Professor Joca Vieira",
        "lat": -5.0625,
        "lng": -42.777
      },
      "paradas": [
        {
          "id": "t1",
          "nome": "Satélite — Praça",
          "regiao": "Satélite",
          "lat": -5.036,
          "lng": -42.77
        },
        {
          "id": "t2",
          "nome": "Satélite — Avenida principal",
          "regiao": "Satélite",
          "lat": -5.04,
          "lng": -42.774
        },
        {
          "id": "t3",
          "nome": "Satélite — Igreja",
          "regiao": "Satélite",
          "lat": -5.044,
          "lng": -42.778
        }
      ],
      "saida": "06:00",
      "chegada": "06:50",
      "retornoSaida": "17:20",
      "retornoChegada": "18:05",
      "ativa": true,
      "exemplo": false,
      "atualizadoEm": 1793819543533
    }
  },
  "alunos": {
    "ex-al-01": {
      "nome": "Ana Clara Sousa",
      "endereco": "Rua São José, 120 — Morros",
      "regiao": "Morros",
      "escolaId": "ex-esc-3",
      "entrada": "07:00",
      "saida": "17:10",
      "rotaId": "ex-rota-1",
      "pontoId": "n1",
      "responsavel": "Maria José Sousa",
      "telefone": "86990000201",
      "codigo": "676NM8",
      "exemplo": true,
      "atualizadoEm": 1793819543533
    },
    "ex-al-02": {
      "nome": "João Pedro Lima",
      "endereco": "Rua Santa Luzia, 157 — Morros",
      "regiao": "Morros",
      "escolaId": "ex-esc-3",
      "entrada": "07:00",
      "saida": "17:10",
      "rotaId": "ex-rota-1",
      "pontoId": "n2",
      "responsavel": "Antônia Lima",
      "telefone": "86990000202",
      "codigo": "MG6VKF",
      "exemplo": true,
      "atualizadoEm": 1793819543533
    },
    "ex-al-03": {
      "nome": "Luiza Fernandes Rocha",
      "endereco": "Rua Planalto, 231 — Planalto Uruguai",
      "regiao": "Planalto Uruguai",
      "escolaId": "ex-esc-3",
      "entrada": "07:00",
      "saida": "17:10",
      "rotaId": "ex-rota-2",
      "pontoId": "s1",
      "responsavel": "Cláudia Fernandes",
      "telefone": "86990000203",
      "codigo": "C36LAE",
      "exemplo": true,
      "atualizadoEm": 1793819543533
    },
    "ex-al-04": {
      "nome": "Davi Lucas Oliveira",
      "endereco": "Rua da Paz, 268 — Planalto Uruguai",
      "regiao": "Planalto Uruguai",
      "escolaId": "ex-esc-3",
      "entrada": "07:00",
      "saida": "17:10",
      "rotaId": "ex-rota-2",
      "pontoId": "s3",
      "responsavel": "Raimundo Oliveira",
      "telefone": "86990000204",
      "codigo": "DCNRB7",
      "exemplo": true,
      "atualizadoEm": 1793819543533
    },
    "ex-al-05": {
      "nome": "Enzo Gabriel Araújo",
      "endereco": "Rodovia BR-343, km 12, casa 3 — Zé de Holanda",
      "regiao": "Zé de Holanda",
      "escolaId": "ex-esc-3",
      "entrada": "07:00",
      "saida": "17:10",
      "rotaId": "ex-rota-3",
      "pontoId": "u1",
      "responsavel": "Luciana Araújo",
      "telefone": "86990000205",
      "codigo": "W6NQU9",
      "exemplo": true,
      "atualizadoEm": 1793819543533
    },
    "ex-al-06": {
      "nome": "Gustavo Ribeiro Leal",
      "endereco": "Vila São José, 18 — Pedra Mole",
      "regiao": "Pedra Mole",
      "escolaId": "ex-esc-3",
      "entrada": "07:00",
      "saida": "17:10",
      "rotaId": "ex-rota-3",
      "pontoId": "u3",
      "responsavel": "Teresa Ribeiro",
      "telefone": "86990000206",
      "codigo": "AF7T4F",
      "exemplo": true,
      "atualizadoEm": 1793819543533
    },
    "ex-al-07": {
      "nome": "Yasmin Freitas Lopes",
      "endereco": "Rua Tipiti, 40 — São Vicente de Baixo",
      "regiao": "São Vicente de Baixo",
      "escolaId": "ex-esc-3",
      "entrada": "07:00",
      "saida": "17:10",
      "rotaId": "ex-rota-4",
      "pontoId": "l1",
      "responsavel": "Patrícia Freitas",
      "telefone": "86990000207",
      "codigo": "SWQUBE",
      "exemplo": true,
      "atualizadoEm": 1793819543533
    },
    "ex-al-08": {
      "nome": "Bernardo Teles Pinheiro",
      "endereco": "Rua da Igreja, 77 — São Vicente",
      "regiao": "São Vicente",
      "escolaId": "ex-esc-3",
      "entrada": "07:00",
      "saida": "17:10",
      "rotaId": "ex-rota-4",
      "pontoId": "l3",
      "responsavel": "Ricardo Pinheiro",
      "telefone": "86990000208",
      "codigo": "G3GU2E",
      "exemplo": true,
      "atualizadoEm": 1793819543533
    },
    "ex-al-09": {
      "nome": "Heloísa Batista Nunes",
      "endereco": "Rua da Praça, 12 — Satélite",
      "regiao": "Satélite",
      "escolaId": "esc-joca-vieira",
      "entrada": "07:00",
      "saida": "17:10",
      "rotaId": "rota-satelite",
      "pontoId": "t1",
      "responsavel": "Rosângela Batista",
      "telefone": "86990000209",
      "codigo": "BAPPD8",
      "exemplo": true,
      "atualizadoEm": 1793819543533
    },
    "ex-al-10": {
      "nome": "Samuel Nogueira Brito",
      "endereco": "Avenida principal, 402 — Satélite",
      "regiao": "Satélite",
      "escolaId": "esc-joca-vieira",
      "entrada": "07:00",
      "saida": "17:10",
      "rotaId": "rota-satelite",
      "pontoId": "t2",
      "responsavel": "José Nogueira",
      "telefone": "86990000210",
      "codigo": "234ENT",
      "exemplo": true,
      "atualizadoEm": 1793819543533
    }
  },
  "consulta": {
    "676NM8": {
      "apelido": "Ana S.",
      "rotaId": "ex-rota-1",
      "pontoId": "n1",
      "escola": "CETI Professor José Amável",
      "entrada": "07:00",
      "saida": "17:10",
      "exemplo": true
    },
    "MG6VKF": {
      "apelido": "João L.",
      "rotaId": "ex-rota-1",
      "pontoId": "n2",
      "escola": "CETI Professor José Amável",
      "entrada": "07:00",
      "saida": "17:10",
      "exemplo": true
    },
    "C36LAE": {
      "apelido": "Luiza R.",
      "rotaId": "ex-rota-2",
      "pontoId": "s1",
      "escola": "CETI Professor José Amável",
      "entrada": "07:00",
      "saida": "17:10",
      "exemplo": true
    },
    "DCNRB7": {
      "apelido": "Davi O.",
      "rotaId": "ex-rota-2",
      "pontoId": "s3",
      "escola": "CETI Professor José Amável",
      "entrada": "07:00",
      "saida": "17:10",
      "exemplo": true
    },
    "W6NQU9": {
      "apelido": "Enzo A.",
      "rotaId": "ex-rota-3",
      "pontoId": "u1",
      "escola": "CETI Professor José Amável",
      "entrada": "07:00",
      "saida": "17:10",
      "exemplo": true
    },
    "AF7T4F": {
      "apelido": "Gustavo L.",
      "rotaId": "ex-rota-3",
      "pontoId": "u3",
      "escola": "CETI Professor José Amável",
      "entrada": "07:00",
      "saida": "17:10",
      "exemplo": true
    },
    "SWQUBE": {
      "apelido": "Yasmin L.",
      "rotaId": "ex-rota-4",
      "pontoId": "l1",
      "escola": "CETI Professor José Amável",
      "entrada": "07:00",
      "saida": "17:10",
      "exemplo": true
    },
    "G3GU2E": {
      "apelido": "Bernardo P.",
      "rotaId": "ex-rota-4",
      "pontoId": "l3",
      "escola": "CETI Professor José Amável",
      "entrada": "07:00",
      "saida": "17:10",
      "exemplo": true
    },
    "BAPPD8": {
      "apelido": "Heloísa N.",
      "rotaId": "rota-satelite",
      "pontoId": "t1",
      "escola": "CETI Professor Joca Vieira",
      "entrada": "07:00",
      "saida": "17:10",
      "exemplo": true
    },
    "234ENT": {
      "apelido": "Samuel B.",
      "rotaId": "rota-satelite",
      "pontoId": "t2",
      "escola": "CETI Professor Joca Vieira",
      "entrada": "07:00",
      "saida": "17:10",
      "exemplo": true
    }
  },
  "avisos": {
    "ex-av-1": {
      "tipo": "alteracao",
      "rotaId": "ex-rota-1",
      "mensagem": "A parada Morros — Praça passa para a esquina em frente à farmácia a partir de quinta-feira.",
      "criadoEm": 1793808743533,
      "data": "2026-11-04",
      "autorId": "",
      "exemplo": true
    },
    "ex-av-2": {
      "tipo": "info",
      "rotaId": "todas",
      "mensagem": "Não haverá transporte na sexta-feira (20/11), feriado nacional da Consciência Negra.",
      "criadoEm": 1793725943533,
      "data": "2026-11-03",
      "autorId": "",
      "exemplo": true
    }
  },
  "status": {},
  "presencas": {},
  "config": {
    "geral": {
      "velocidade": 24,
      "fator": 1.3,
      "parada": 1.5,
      "garagem": {
        "nome": "Garagem SchoolBus",
        "lat": -5.1012,
        "lng": -42.8092
      }
    }
  }
};
