# teste-kabum

Projeto full-stack com **PHP puro (API com JWT)** no backend e **React + Vite** no frontend, usando **Docker**.

---

## Tecnologias

- **Backend**:  
  - PHP puro, sem frameworks  
  - Autenticação via **JWT** (JSON Web Token)  
  - Estrutura modular com Controllers e Database  
  - Scripts para migração e seed de banco (`migrate.php` e `Seeder.php`)  

- **Frontend**:  
  - React + Vite para desenvolvimento rápido e moderno  
  - Componentização e rotas SPA  
  - Suporte a requisições para API backend  

- **Banco de dados**:  
  - MySQL rodando em container Docker  
  - Migrações e seeders para popular tabelas iniciais  

- **Infraestrutura**:  
  - Docker + Docker Compose para orquestrar backend, frontend e banco  

---

## Estrutura do projeto

```
teste-kabum/
├── backend/
│   ├── app/
│   │   ├── Controllers/   # Lógica da API
│   │   ├── Database/      # Migrações e seeders
│   │   │   ├── migrate.php
│   │   │   └── Seeder.php
│   │   └── ...
│   ├── public/            # Raiz do backend
│   └── ...
├── frontend/
│   ├── src/               # Código React
│   ├── public/            # Arquivos estáticos
│   └── ...
├── docker-compose.yml
└── README.md
```

---

## Pré-requisitos

- Git  
- Docker  
- Docker Compose  

---

## Como rodar

1. Clonar o repositório:
```bash
git clone https://github.com/rafinha-adao/teste-kabum.git
cd teste-kabum
```

2. Subir os containers:
```bash
docker-compose up --build -d
```

3. Criar e popular o banco:
```bash
docker-compose exec backend php app/Database/migrate.php
docker-compose exec backend php app/Database/Seeder.php
```

---

## Acesso

- Frontend → http://localhost:5173  
- Backend → http://localhost:8000  

---

## Testes básicos

- **Backend (PHP)**: PHPUnit  
- **Frontend (React)**: Jest / Vitest

---

## Comandos úteis

- Parar containers:
```bash
docker-compose down
```

- Ver logs:
```bash
docker-compose logs -f
```

- Reconstruir containers:
```bash
docker-compose up --build -d
```

---
