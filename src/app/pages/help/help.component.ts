import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-help",
  templateUrl: "./help.component.html",
  styleUrls: ["./help.component.scss"],
})
export class HelpComponent implements OnInit {
  questions = [
    {
      q: "¿Qué es TuneIT?",
      a:
        "TuneIT es un reproductor de música y podcasts en streaming que te permite compartir canciones/podcasts/listas de reproducción con otros usuarios amigos. También permite la creación de listas de reproducción de canciones, suscribirse a artistas para enterarse de sus últimas canciones y guardar tus podcasts favoritos.",
      hide: "hide",
    },
    {
      q: "No consigo iniciar sesión, ¿qué hago?",
      a:
        "Si no puedes iniciar sesión, puede deberse a que no exista el usuario o que la contraseña sea incorrecta. En el primer caso, registrate con tu correo electrónico para poder iniciar sesión y en el segundo, revisa tu contraseña y vuelve a introducirla.",
      hide: "hide",
    },
    {
      q: "¿No te ha llegado el mensaje de confirmación de la cuenta?",
      a:
        "Si el registro de la cuenta fue exitoso, se te habrá enviado un correo de confirmación. Revisa tu carpeta de spam/correo no deseado o las carpetas con filtros que tengas.",
      hide: "hide",
    },
    {
      q:
        "Me voy a vivir a otro país, ¿puedo cambiar el país asignado a mi cuenta?",
      a:
        "Sí, desde la configuración del usuario (accesible desde tu perfil) puedes cambiar tu país de residencia por alguno de los disponibles.",
      hide: "hide",
    },
    {
      q:
        "¿Dónde se encuentran las canciones/podcasts/listas que han compartido conmigo?",
      a:
        "Desde la pestaña ‘Notificaciones’ puedes mirar todas las canciones/podcasts/listas que tus amigos han compartido contigo. Si se trata de una lista, puedes acceder a ella, escuchar las canciones presentes en ella y añadirla a tus listas.",
      hide: "hide",
    },
    {
      q: "¿Dónde puedo usar TuneIT?",
      a:
        "TuneIT se encuentra presente en versión web, accesible para todos los dispositivos con conexión a Internet, y en versión Android para mayor comodidad para usuarios móviles.",
      hide: "hide",
    },
    {
      q: "¿Es necesario tener conexión a Internet continuamente?",
      a:
        "Sí, al reproducirse todas las canciones y podcasts en streaming, es necesario tener Internet para la comunicación con el servidor y obtener las canciones.",
      hide: "hide",
    },
    {
      q: "¿Cómo busco a otros usuarios?",
      a:
        "Puedes buscar a otros usuarios y agregarlos como amigos desde la pestaña ‘Amigos’ y buscar por el nombre público que tienen. Cuando te acepten como amigo, aparecerá en tu lista de amigos y podrás compartir canciones, podcasts y tus listas de reproducción con él.",
      hide: "hide",
    },
    {
      q: "¿Puedo eliminar mi cuenta?",
      a:
        "Sí, desde la configuración del usuario (accesible desde tu perfil) puedes eliminar tu cuenta introduciendo tu contraseña actual.",
      hide: "hide",
    },
  ];

  constructor() {}

  show(index) {
    if(this.questions[index].hide === "show") {
      this.questions[index].hide = "show hide";
      return;
    }
    for(let i = 0; i < this.questions.length; ++i) {
      if(this.questions[i].hide === "show") {
        this.questions[i].hide = "show hide";
      }
    }
    this.questions[index].hide = "show";
  }

  ngOnInit(): void {}
}
