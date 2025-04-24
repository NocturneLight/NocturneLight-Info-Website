import {AfterViewInit, Component, ElementRef, Renderer2, ViewChild, HostListener, Inject} from "@angular/core";
import {DOCUMENT, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-landing-message',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './landing.message.component.html',
  styleUrl: './landing.message.component.css'
})

export class LandingMessageComponent implements AfterViewInit
{
  private messageList: string[] = [
    "Simple. Clean. Maintainable. The qualities I strive for when I forge great software.",
    "A creative flame of passion stoked by the video games of my childhood."
  ];

  private imagePaths: [image: string, artist: string][] = [
    ["assets/Landing_Page/genocide1.jpg", "MyssDark"],
    ["assets/Landing_Page/genocide2.jpg", "MyssDark"],
    ["assets/Landing_Page/genocide3.jpg", "MyssDark"],
    ["assets/Landing_Page/aqua1.jpg", "Zylinder"],
    ["assets/Landing_Page/aqua2.jpg", "Zylinder"],
    ["assets/Landing_Page/aqua3.jpg", "Zylinder"],
    ["assets/Landing_Page/epoch1.jpg", "Amaco Studio and DeadFishDream"],
    ["assets/Landing_Page/epoch2.jpg", "Amaco Studio and DeadFishDream"],
    ["assets/Landing_Page/epoch3.jpg", "Amaco Studio and DeadFishDream"]
  ];

  private backgroundIndex: number = 0;
  private messageListIndex: number = 0;
  private messageCharacterIndex: number = 0;
  public upsideDownTrianglePath: string = "assets/UpsideDownTriangle.svg"
  private imageCycleTimeoutId: ReturnType<typeof setTimeout> = setTimeout(() => {});
  public currentBackground: [image: string, artist: string] = this.imagePaths[this.backgroundIndex];

  @ViewChild("message") messageElement: ElementRef | undefined;
  @ViewChild("aboutText") aboutTextElement: ElementRef | undefined;
  @ViewChild("wizardHat") wizardHatElement: ElementRef | undefined;
  @ViewChild("backgroundImage") imageElement: ElementRef | undefined;
  @ViewChild("floatingTriangle") triangleElement: ElementRef | undefined;

  constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document: Document) {}

  // Begins the typewriter effect on the element holding the currentMessage field
  // as well as any other start-up sequences that need to happen.
  // For further reference, see: https://angular.dev/guide/components/lifecycle#ngafterviewinit
  ngAfterViewInit(): void
  {
    this.beginTextCycle();
  }

  // Cycles between the messages in the messageList variable and displays
  // the message using a typewriter effect.
  private beginTextCycle(): void
  {
    this.displayMessage(); // NOTE: Can't inline this since it's a recursive function.
  }

  // Fades in each character of a message until the whole message is visible.
  private displayMessage(): void
  {
    const message: string = this.messageList[this.messageListIndex];
    const span: Element = this.renderer.createElement("span");

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
        this.displayMessage();
    }, 75);
  }

  // Runs upon the completion of any animation associated with the message element.
  // If the fade out animation plays, clears out the main h1 element holding the message
  // and sets things up before starting the next message.
  public cleanUpMessage(event: AnimationEvent): void
  {
    // Do nothing if it is not the fadeOutEffect that is playing.
    if (!event.animationName.includes("fadeOutEffect"))
      return;

    this.messageCharacterIndex = 0;
    this.messageListIndex = (this.messageListIndex + 1) % this.messageList.length; // Modulus to ensure we are always in bounds.

    this.renderer.setProperty(this.messageElement?.nativeElement, "innerHTML", "");
    this.renderer.removeClass(this.messageElement?.nativeElement, "fade-out");

    // Wait 2500 milliseconds before starting to show the next message.
    setTimeout(() => this.beginTextCycle(), 2500);
  }

  // Runs upon the completion of any animation associated with the background image element.
  // Holds the current background image for 3000 milliseconds and then fades it out, increments
  // the image index, and then fades in the new image to show.
  public imageAnimationController(event: AnimationEvent): void
  {
    // Do nothing if less than 50% of the image is visible.
    if (!this.isElementInViewport(this.imageElement?.nativeElement, 50))
      return;

    // Wait 3000 milliseconds, then fade out the current image when the
    // fade in effect has finished.
    if (event.animationName.includes("fadeInEffect"))
    {
      this.imageCycleTimeoutId = setTimeout(() => this.fadeOutImage(), 5000);
    }
    // Increment the background image index and get the current
    // image from the list, then fade in the new image when the
    // fade out effect has finished.
    else if (event.animationName.includes("fadeOutEffect"))
    {
      this.backgroundIndex = (this.backgroundIndex + 1) % this.imagePaths.length; // Modulus to ensure we're always in bounds.
      this.currentBackground = this.imagePaths[this.backgroundIndex];

      this.fadeInImage();
    }
  }

  // Runs the fade out animation then removes the fade in animation to prevent
  // conflicts from occurring.
  private fadeOutImage(): void
  {
    this.renderer.addClass(this.imageElement?.nativeElement, "fade-out");
    this.renderer.removeClass(this.imageElement?.nativeElement, "fade-in");
  }

  // Runs the fade in animation then removes the fade out animation to prevent
  // conflicts from occurring.
  private fadeInImage(): void
  {
    this.renderer.addClass(this.imageElement?.nativeElement, "fade-in");
    this.renderer.removeClass(this.imageElement?.nativeElement, "fade-out");
  }

  // Runs the fade out animation then removes the fade in animation for the
  // upside-down triangle.
  private fadeOutTriangle(): void
  {
    this.renderer.addClass(this.triangleElement?.nativeElement, "fade-out-triangle");
    this.renderer.removeClass(this.triangleElement?.nativeElement, "fade-in-triangle");
  }

  // Runs the fade in animation then removes the fade out animation for the
  // upside-down triangle.
  private fadeInTriangle()
  {
    this.renderer.addClass(this.triangleElement?.nativeElement, "fade-in-triangle");
    this.renderer.removeClass(this.triangleElement?.nativeElement, "fade-out-triangle");
  }

  // Runs the fade out animation then removes the fade in animation for the
  // upside-down triangle.
  private fadeOutAboutText(): void
  {
    this.renderer.addClass(this.aboutTextElement?.nativeElement, "fade-out");
    this.renderer.removeClass(this.aboutTextElement?.nativeElement, "fade-in");
  }

  // Runs the fade in animation then removes the fade out animation for the
  // upside-down triangle.
  private fadeInAboutText(): void
  {
    this.renderer.addClass(this.aboutTextElement?.nativeElement, "fade-in");
    this.renderer.removeClass(this.aboutTextElement?.nativeElement, "fade-out");
  }

  // Runs the fade out animation on the wizard hat, and then removes the fade in animation.
  private fadeOutWizardHat(): void
  {
    this.renderer.addClass(this.wizardHatElement?.nativeElement, "fade-out");
    this.renderer.removeClass(this.wizardHatElement?.nativeElement, "fade-in");
  }

  // Runs the fade in animation on the wizard hat, and then removes the fade out animation.
  private fadeInWizardHat(): void
  {
    this.renderer.addClass(this.wizardHatElement?.nativeElement, "fade-in");
    this.renderer.removeClass(this.wizardHatElement?.nativeElement, "fade-out");
  }

  // Function which runs when the user clicks on the upside-down triangle.
  // Scrolls the webpage to the given element.
  public scrollDown(scrollToElement: HTMLElement): void
  {
    scrollToElement.scrollIntoView();
  }

  // Checks if an element is on screen by at least a given certain percentage.
  // Code adapted from: https://stackoverflow.com/questions/30943662/check-if-element-is-partially-in-viewport/51121566#51121566
  private isElementInViewport(element: Element, percentVisible: number): boolean
  {
    const currentWindow: Window | undefined = this.document.defaultView?.window;
    let rectangle: DOMRect = element.getBoundingClientRect();
    let windowHeight: number = (currentWindow?.innerHeight || this.document.documentElement.clientHeight);

    return !(
      Math.floor(100 - (((rectangle.top >= 0 ? 0 : rectangle.top) / +-rectangle.height) * 100)) < percentVisible ||
      Math.floor(100 - ((rectangle.bottom - windowHeight) / rectangle.height) * 100) < percentVisible
    );
  }

  // Function which runs whenever the user scrolls the webpage.
  // Fades in and out certain images depending on how much of it is on screen and
  // if certain classes are presently attached to it.
  @HostListener('window:scroll', ['$event'])
  public scrollEvent(): void
  {
    // Fade in the image about text, and wizard hat while fading out the upside-down triangle.
    if (this.isElementInViewport(this.imageElement?.nativeElement, 50))
    {
      this.fadeOutTriangle();
      this.fadeInWizardHat()
      this.fadeInImage();
      this.fadeInAboutText();
    }
    // Fade out the image, about text, and hat while fading in the upside-down triangle.
    else if (this.isElementInViewport(this.imageElement?.nativeElement, 25)
      && this.imageElement?.nativeElement.classList.contains("fade-in"))
    {
      this.fadeInTriangle();
      this.fadeOutWizardHat()
      this.fadeOutImage();
      this.fadeOutAboutText();

      clearTimeout(this.imageCycleTimeoutId); // Clear the currently running timeout to prevent side effects.
    }
  }
}
