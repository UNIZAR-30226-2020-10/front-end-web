export interface Song {
  Album: string
  Artistas: Array<string>
  ID: number
  Imagen: string
  Nombre: string
  URL: string
}

interface ReproList {
  Desc: string
  ID: number
  Imagen: string
  Nombre: string
}

export interface List {
  Canciones: Array<Song>
  list: ReproList
}

export interface Playlists {
  ID: number
  playlist: ReproList
}
