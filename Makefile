.PHONY: help build_up down logs clean restart status ps shell test lint format build build-no-cache init prune info

help:
	@echo "ArguMate-AI commands: build_up down logs logs-backend logs-frontend logs-db status ps restart shell-backend shell-frontend shell-db migrate seed backup restore test lint format build build-no-cache init prune info"

build_up:
	docker-compose up --build

down:
	docker-compose down

clean:
	docker-compose down -v --remove-orphans
	rm -f .env

logs:
	docker-compose logs -f

logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

logs-db:
	docker-compose logs -f postgres

status:
	docker-compose ps

ps:
	docker-compose ps

restart:
	docker-compose restart

shell-backend:
	docker-compose exec backend /bin/sh

shell-frontend:
	docker-compose exec frontend /bin/sh

shell-db:
	docker-compose exec postgres psql -U argumate_user -d argumate_db

migrate:
	docker-compose exec backend alembic upgrade head

seed:
	docker-compose exec backend python -c "from app.db.seed import seed_db; seed_db()"

backup:
	mkdir -p backups
	docker-compose exec postgres pg_dump -U argumate_user argumate_db > backups/argumate_backup_$$(date +%Y%m%d_%H%M%S).sql

restore:
	@if [ -z "$$(ls -A backups/*.sql 2>/dev/null)" ]; then \
		echo "No backup files found"; \
		exit 1; \
	fi
	@ls -1 backups/*.sql | nl -w2 -s'. '
	@read -p "Select backup number to restore: " backup_num; \
	backup_file=$$(ls -1 backups/*.sql | sed -n "$$backup_num p"); \
	if [ -f "$$backup_file" ]; then \
		docker-compose exec -T postgres psql -U argumate_user argumate_db < "$$backup_file"; \
	else \
		echo "Invalid selection"; \
		exit 1; \
	fi

test:
	docker-compose exec backend pytest -v --tb=short

lint:
	docker-compose exec backend flake8 app/ --max-line-length=100
	docker-compose exec backend mypy app/

format:
	docker-compose exec backend black app/
	docker-compose exec backend isort app/

build:
	docker-compose build

build-no-cache:
	docker-compose build --no-cache

init: build_up migrate seed

prune:
	docker system prune -f

info:
	docker --version
	docker-compose --version

.DEFAULT_GOAL := help
