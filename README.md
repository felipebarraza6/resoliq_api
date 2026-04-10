# Resoliq API

API REST construida con Django REST Framework.

## Requisitos

- Docker
- Docker Compose

## Configuración para Despliegue (SQLite)

### 1. Configurar variables de entorno

Copia el archivo de ejemplo y configura tus valores:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:

```env
DEBUG=False
SECRET_KEY=tu-clave-secreta-muy-segura-cambia-esto-en-produccion
ALLOWED_HOSTS=tu-dominio.com,www.tu-dominio.com
```

**Importante:** Cambia `SECRET_KEY` por una clave segura en producción.

### 2. Construir e iniciar el contenedor

```bash
docker-compose up --build -d
```

### 3. Crear superusuario (opcional)

```bash
docker-compose exec api python manage.py createsuperuser
```

### 4. Verificar que todo funciona

```bash
curl http://localhost:8000/api/
```

## Comandos útiles

```bash
# Ver logs
docker-compose logs -f api

# Detener el servicio
docker-compose down

# Reiniciar
docker-compose restart

# Acceder al shell del contenedor
docker-compose exec api bash

# Ejecutar migraciones manualmente
docker-compose exec api python manage.py migrate

# Recolectar archivos estáticos
docker-compose exec api python manage.py collectstatic --noinput
```

## Desarrollo local (sin Docker)

```bash
# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# o
venv\Scripts\activate  # Windows

# Instalar dependencias
pip install -r api/requirements.txt

# Configurar variables de entorno para desarrollo
export DEBUG=True
export SECRET_KEY=dev-secret-key
export ALLOWED_HOSTS=*

# Migrar base de datos
python manage.py migrate

# Iniciar servidor de desarrollo
python manage.py runserver
```

## Notas

- La base de datos SQLite se almacena en `db.sqlite3` en la raíz del proyecto
- Los archivos media se almacenan en el directorio `media/`
- Los archivos estáticos se almacenan en el directorio `static/`
