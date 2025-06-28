import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET(request: NextRequest) {
  try {
    // Chemin vers le fichier JSON
    const filePath = join(process.cwd(), 'src/data/pc_parts_full_database.json')
    
    // Lire le fichier
    const fileContents = readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileContents)
    
    // Ajouter des headers pour le cache
    const response = NextResponse.json(data)
    response.headers.set('Cache-Control', 'public, max-age=3600') // Cache 1 heure
    
    return response
  } catch (error) {
    console.error('Erreur lors du chargement des composants:', error)
    return NextResponse.json(
      { error: 'Impossible de charger la base de données des composants' },
      { status: 500 }
    )
  }
} 