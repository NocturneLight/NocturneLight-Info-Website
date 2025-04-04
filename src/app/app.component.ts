// TODO: Remove the commented out code.
import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  Renderer2
} from '@angular/core';
//import { RouterOutlet } from '@angular/router';
//import { TodosComponent } from './todos/todos.component';
import {Amplify} from 'aws-amplify';
import outputs from '../../amplify_outputs.json';
//import { AmplifyAuthenticatorModule, AuthenticatorService } from '@aws-amplify/ui-angular';

Amplify.configure(outputs);

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [

  ],
  //imports: [RouterOutlet, TodosComponent, AmplifyAuthenticatorModule],
})

export class AppComponent implements AfterViewInit {
  public title: string = 'amplify-angular-template';
  private messageListIndex: number = 0;
  private messageCharacterIndex: number = 0;

  public messageList: string[] = [
    "A steel blade of exceptional software design forged by a blaze of bad code.",
    "A flame of creativity stoked by the greatest games an imaginative child with an Nintendo 64 could play."
  ];

  @ViewChild("message") messageElement: ElementRef | undefined;

  constructor(private renderer: Renderer2 /*public authenticator: AuthenticatorService*/)
  {
    Amplify.configure(outputs);
  }

  // Begins the typewriter effect on the element holding the currentMessage field
  // as well as any other start up sequences that need to happen.
  // For further reference, see: https://angular.dev/guide/components/lifecycle#ngafterviewinit
  ngAfterViewInit(): void
  {
    this.beginTextCycle();
  }

  // Cycles between the messages in the messageList variable and displays
  // the message using a typewriter effect.
  private beginTextCycle(): void
  {
    this.messageListIndex = (this.messageListIndex + 1) % this.messageList.length; // Modulus to ensure we are always in bounds.
    this.displayMessage() // NOTE: Can't inline this since it's a recursive function.
  }

  // Fades in each character of a message until the whole message is visible.
  private displayMessage(): void
  {
    const message: string = this.messageList[this.messageListIndex];
    const span: Element = this.renderer.createElement("span")

    // Adds the current character in the message to a span element, and then adds that to the h1
    // element that holds the whole message, and then starts the fade in animation on the span element.
    this.renderer.setProperty(span, "innerHTML", message.charAt(this.messageCharacterIndex));
    this.renderer.addClass(span, "fade-in");
    this.renderer.appendChild(this.messageElement?.nativeElement, span);
    this.messageCharacterIndex++;

    // Waits 75 milliseconds before either recursively calling this function to go to the
    // next character, or wait an additional 2500 milliseconds before starting the fade out animation.
    setTimeout(() => {
      if (this.messageCharacterIndex === message.length)
        setTimeout(() => this.renderer.addClass(this.messageElement?.nativeElement, "fade-out"), 2500);
      else
        this.displayMessage()
    }, 75);
  }

  // Runs upon the completion of any animation. If the fade out animation plays, clears out
  // the main h1 element holding the message and sets things up before starting the next message.
  public cleanUpMessage(event: AnimationEvent): void
  {
    // Do nothing if it is not the fadeOutEffect that is playing.
    if (!event.animationName.includes("fadeOutEffect"))
      return;

    this.messageCharacterIndex = 0;
    this.renderer.setProperty(this.messageElement?.nativeElement, "innerHTML", "")
    this.renderer.removeClass(this.messageElement?.nativeElement, "fade-out");

    // Wait 2500 milliseconds before starting to show the next message.
    setTimeout(() => this.beginTextCycle(), 2500);
  }
}

