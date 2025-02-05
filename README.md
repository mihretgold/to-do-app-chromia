Mihret Agengenhu  
mihretagegnhu2@gmail.com  

# To-Do App  
## Chromia Next.js License  
A blockchain-powered task management system ensuring immutability, security, and transparency via Chromia.

## Table of Contents  
- Overview  
- Installation  
- Architecture  
- Smart Contract (Backend)  
- Frontend  
- Security  
- Testing  
- Deployment  
- Acknowledgements  
- Contact  

## Overview  
### Purpose  
A decentralized application (dApp) for managing tasks on the Chromia blockchain, designed to:  
- Ensure data integrity through immutable ledger storage.  
- Provide end-to-end security via cryptographic authentication.  

### Key Features  
| Feature | Description |  
|---------|-------------|  
| User Registration | Secured by Chromia’s ft4 auth descriptors (multi-sig/EVM-compatible). |  
| Task CRUD | Create, Read, Update, Delete tasks with blockchain-verified ownership. |   

### Target Audience  
- **Developers**: Explore blockchain integration patterns.  
- **End Users**: Manage tasks in a trustless, decentralized environment.  

## Installation  
### Prerequisites  
- Node.js v18+  
- PostgreSQL v16.3+  
- Docker (for local node setup)  
- Chromia CLI (chr)  

Check for installation on the Chromia official website:  
[Chromia Installation Guide](https://docs.chromia.com/intro/installation/)  

### Backend Setup  
Clone the repository:  
```bash  
git clone [https://github.com/ ](https://github.com/mihretgold/to-do-app-chromia.git)
cd rell_backend  
```  
Install dependencies:  
```bash  
chr install  
```  
 
**Note:** Stop any local PostgreSQL service before running `docker-compose up -d` to avoid connection errors.  

Deploy the smart contract:  
```bash  
chr node start  
```

### Frontend Setup  
Clone the frontend repository:  
```bash  
git clone https://github.com/NahomKeneni/front_end.git  
cd front_end  
```  
Install dependencies:  
```bash  
npm install  
pnpm install  
npm install @chromia/ft4@0.8.0  
```  
Run the development server:  
```bash  
npm run dev  
```  

### Project Structure  
#### Backend Repository Layout (`rell_backend`)  
```plaintext  
todo-backend/  
├── chromia.yml               # Chromia blockchain network settings  
├── src/  
│   ├── development.rell      # Development environment setup  
│   ├── main.rell             # Primary module imports and initialization  
│   ├── registration/         # EVM-compatible user registration system  
│   │   ├── module.rell       # User account creation logic  
│   │   └── test/            # Registration test suite  
│   ├── test/                # End-to-end test framework  
│   └── to_do/               # Core task management logic  
│       ├── auth.rell         # FT4 session authentication handlers  
│       ├── dto.rell          # Data transfer object schemas  
│       ├── model.rell        # Database entity definitions  
│       ├── module.rell       # Dependency injection and module linking  
│       ├── operations.rell   # CRUD operations for tasks  
│       └── queries.rell      # Task query system with filters  
```

## Smart Contract (Backend)  
### Core Modules  
#### Authentication (`auth.rell`)  
```rell  
operation create_user(name: text, auth_descriptor: auth_descriptor) {  
  require(name.length > 0, "Invalid name");  
  create user(name, auth_descriptor);  
}  
```

### Task Operations (`operations.rell`)  
- Enforces ownership checks for task updates/deletes.  
- Implements CRUD operations securely.  

## Frontend  
### Component Structure  
| Component | Purpose |  
|------------|----------|  
| register/page.tsx | EVM wallet-based user registration |  
| useTodos.ts | Manages task state with localStorage sync |  
| TodoItem.tsx | Renders task cards with edit/delete actions |  

## Security  
- **Input Validation:** Rejects empty/malformed payloads.  
- **Auth Descriptors:** Multi-sig policies for critical operations.  

## Testing  
### Backend Tests  
Run unit tests:  
```bash  
chr test  
```
Expected output:  
```plaintext  
# TEST: registration.test.registration_test:test_evm_registration  
# OK: registration.test.registration_test:test_evm_registration (13.373s)  
# TEST: test.to_do_project_test:test_create_entities  
# OK: test.to_do_project_test:test_create_entities (9.683s)  
```   
**Author:** Mihret Agengenhu  
**Email:** mihretagegnhu2@gmail.com

