export interface Song {
  Album: string
  Artistas: Array<string>
  ID: number
  Imagen: string
  Nombre: string
  URL: string
}

export interface Playlists {
  Desc: string
  ID: number
  Imagen: string
  Nombre: string
}

export interface List {
  Canciones: Array<Song>
  Desc: string
  ID: number
  Imagen: string
  Nombre: string
}
