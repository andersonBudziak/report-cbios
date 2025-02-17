
from fastapi import FastAPI, HTTPException
from typing import List, Dict
import json

app = FastAPI()

# Rota para listar todos os relatórios (retorna GeoJSON)
@app.get("/api/reports")
async def get_reports():
    with open("reports-list.json") as f:
        return json.load(f)

# Rota para obter detalhes de um relatório específico
@app.get("/api/reports/{report_id}")
async def get_report_details(report_id: str):
    with open("report-details.json") as f:
        data = json.load(f)
        if data["id"] == report_id:
            return data
        raise HTTPException(status_code=404, detail="Report not found")

# Rota para obter imagens de um relatório
@app.get("/api/reports/{report_id}/images/{image_number}")
async def get_report_image(report_id: str, image_number: int):
    if not 1 <= image_number <= 3:
        raise HTTPException(status_code=400, detail="Image number must be between 1 and 3")
    
    with open("report-images.json") as f:
        data = json.load(f)
        if data["reportId"] == report_id:
            return data["images"][str(image_number)]
        raise HTTPException(status_code=404, detail="Report not found")

# Documentação das rotas:
"""
1. GET /api/reports
   - Retorna: GeoJSON com lista de todos os relatórios e suas coordenadas
   - Usado na página principal para o mapa e lista

2. GET /api/reports/{report_id}
   - Parâmetros: ID do relatório
   - Retorna: Detalhes completos do relatório
   - Usado na página de detalhes do relatório

3. GET /api/reports/{report_id}/images/{image_number}
   - Parâmetros: ID do relatório e número da imagem (1, 2 ou 3)
   - Retorna: Detalhes da imagem específica
   - Usado na página de detalhes para carregar cada imagem
"""
