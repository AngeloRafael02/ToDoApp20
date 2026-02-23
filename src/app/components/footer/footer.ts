import { Component } from "@angular/core";
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { DomSanitizer } from "@angular/platform-browser";


@Component({
  selector:'app-footer',
  imports:[
    MatIconModule,
    MatToolbarModule,
    MatListModule
  ],
  template:`
    <footer class="site-footer">
      <div class="footer-container">
        <div class="footer-column">
          <h3>Follow My Socials</h3>
          <div class="social-icons">
            @for (social of socials; track social) {
              <a [href]="social.link" target="_blank" [aria-label]="social.name"><mat-icon [svgIcon]="social.svgName"></mat-icon></a>
            }
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; {{currentYear}} Gemini Solutions. All rights reserved.</span>
      </div>
    </footer>
  `,
  styles:`
  .site-footer {
    width: 100%;
    margin-top: auto;
background-color: #333;
      color: #ccc;
    .footer-container {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;

      .footer-column {
        display: flex;
        flex-direction: column;
        min-width: 200px;
        margin-bottom: 20px;

        h3 {
          margin-bottom: 15px;
          font-size: 1.2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        }

        .social-icons {
          display: flex;
          gap: 15px;
          mat-icon {
            font-size: 24px;
            color: white;
          }
        }
      }
    }

    .footer-bottom {
      text-align: center;
      padding: 15px 0;
      font-size: 0.85rem;
    }
  }
  `
})
export class FooterComponent {
  public currentYear:string = new Date().getFullYear().toString();
  public socials = [
    {name:'github', link:'https://github.com/AngeloRafael02', svgName:`logo-github`},
    {name:'facebook', link:'https://www.facebook.com/angelorafael.recio.5', svgName:`logo-facebook`},
    {name:'linkedin', link:'https://www.linkedin.com/in/angelo-rafael-recio-95a02a1a5/', svgName:`logo-linkedin`},
    {name:'google', link:'mailto:recioangelorafael@gmail.com?subject=Support Request"', svgName:`logo-google`}
  ]

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    this.socials.forEach((item,index)=> {
      iconRegistry.addSvgIcon(`logo-${item.name}`, sanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${item.name}.svg`));
    });
  }
}
