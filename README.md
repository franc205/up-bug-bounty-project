# Práctica de desarrollo de plataforma de Bug Bounty para la Universidad de Palermo
Este repositorio contiene el desarrollo de una plataforma de Bug Bounty para prácticas en la Universidad de Palermo.

### Materia
Arquitectura Web

### Integrante
Francisco Canteli

### Descripción del proyecto

El objetivo de este projecto es crear una API que permita a las distintas empresas crear múltiples programas de Bug Bounty y mediante estos, realizar una gestión de las vulnerabilidades envíadas por los Pentesters.

Los usuarios en la plataforma son los siguientes:
    
* **Usuario Hacker:** Usuario que únicamente puede envíar vulnerabilidades y ver programas de Bountys existentes. Este es un usuario que puede ser creado públicamente (Mediante los endpoints de Users)
    
* **Usuario Empresa:** Usuario que puede solamente ver y modificar información sobre su propia empresa, crear programas de Bounties y visualizar vulnerabilidades de los programas pertenecientes únicamente de su empresa. Este usuario debe ser creado desde el Backend. Estos usuarios serán los encargados de decidir si la vulnerabilidad es válida o no.
    
* **Usuario Admin:** Este usuario puede administrar completamente la plataforma.

### Instalación
```
git clone https://github.com/franc205/up-bug-bounty-project.git
cd up-bug-bounty-project
npm install
npm run
```
