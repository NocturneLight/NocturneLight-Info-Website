// TODO: Remove the commented out code.
import {
  AfterViewInit,
  Component
} from '@angular/core';
//import { RouterOutlet } from '@angular/router';
//import { TodosComponent } from './todos/todos.component';
import {Amplify} from 'aws-amplify';
import outputs from '../../amplify_outputs.json';
import {LandingMessageComponent} from "./landing-message/landing.message.component";
//import { AmplifyAuthenticatorModule, AuthenticatorService } from '@aws-amplify/ui-angular';

Amplify.configure(outputs);

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    LandingMessageComponent
  ],
  //imports: [RouterOutlet, TodosComponent, AmplifyAuthenticatorModule],
})

export class AppComponent implements AfterViewInit {
  public title: string = 'amplify-angular-template';

  constructor(/*public authenticator: AuthenticatorService*/)
  {
    Amplify.configure(outputs);
  }

  ngAfterViewInit(): void {}
}

