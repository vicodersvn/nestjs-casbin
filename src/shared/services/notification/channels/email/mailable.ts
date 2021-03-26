import { isNil } from 'lodash';
import { MailableDefaultStyle } from './default.style';

export interface IMailableNodeMailerParams {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export interface IMailable {
  from(from_address: string, name: string): IMailable;
  to(address: string): IMailable;
  cc(address: string): IMailable;
  bcc(address: string): IMailable;
  attach(attachment: string): IMailable;
  subject(subject: string, customStyle?: string): IMailable;
  greeting(msg: string, customStyle?: string): IMailable;
  greeting(msg: string, customStyle?: string): IMailable;
  line(text: string, customStyle?: string): IMailable;
  section(data: string, customStyle?: string): IMailable;
  action(text: string, link: string, type?: string): IMailable;
  buildContent(): string;
  getParams(): IMailableNodeMailerParams;
}

export class Mailable implements IMailable {
  private _content = '';
  private _to_addresses: string[] = [];
  private _greeting: any;
  private _customGreetingStyle: any;
  private _customSubjectStyle: any;
  private _attachments: any[];
  private _ccs: any[];
  private _bccs: any[];
  private _from_address: string;
  private _subject: string;
  constructor() {
    if (!isNil(process.env.DEFAULT_SENDER_EMAIL) && process.env.DEFAULT_SENDER_EMAIL !== '') {
      if (!isNil(process.env.DEFAULT_SENDER) && process.env.DEFAULT_SENDER !== '') {
        this._from_address = `"${process.env.DEFAULT_SENDER}" ${process.env.DEFAULT_SENDER_EMAIL}`;
      } else {
        this._from_address = process.env.DEFAULT_SENDER_EMAIL;
      }
    }
  }

  /**
   * Comma separated list or an array of recipients email addresses that will appear on the To: field
   *
   * @param {*} to String | Array
   *
   * @return self
   */
  to(address: string): IMailable {
    this._to_addresses.push(address);
    return this;
  }

  /**
   * recipient email addresses that will appear on the Cc: field
   *
   * @param {*} cc String
   *
   * @return self
   */

  cc(address: string): IMailable {
    this._ccs.push(address);
    return this;
  }

  /**
   * recipient email addresses that will appear on the bcc: field
   *
   * @param {*} bcc String
   *
   * @return self
   */

  bcc(address: string): IMailable {
    this._bccs.push(address);
    return this;
  }

  /**
   * Attachment object
   *
   * @param {*} attachment Object
   *
   * @return self
   */

  attach(attachment: string): IMailable {
    this._attachments.push(attachment);
    return this;
  }

  /**
   * The email address of the sender.‘
   *
   * @param {*} from String | Array
   * @param {*} name String | Array
   *
   * @return self
   */
  from(from_address: string, name: string): IMailable {
    if (isNil(from_address)) {
      throw new Error("sender's email is required");
    }
    if (isNil(name) || name === '') {
      this._from_address = from_address;
    } else {
      this._from_address = `"${name}" <${from_address}>`;
    }
    return this;
  }

  /**
   * The subject of the email
   *
   * @param {*} subject String
   * @param {*} customStyle Object
   *
   * @return self
   */
  subject(content = '', customStyle?: string): IMailable {
    if (customStyle) {
      this._customSubjectStyle = customStyle;
    }
    this._subject = content;
    return this;
  }

  /**
   * Add a greeting line to email content
   *
   * @param {*} msg String
   * @param {*} customStyle Object
   *
   * @return self
   */
  greeting(msg = '', customStyle?: string): IMailable {
    this._customGreetingStyle = customStyle;
    this._greeting = msg;
    return this;
  }

  /**
   * Add a line to email content
   *
   * @param {*} text String
   * @param {*} customStyle Object
   *
   * @return self
   */

  line(text = '', customStyle?: string): IMailable {
    this._content += isNil(customStyle) ? `<p style="${MailableDefaultStyle.paragraph}">${text}</p>` : `<p style="${MailableDefaultStyle.paragraph} ${customStyle}">${text}</p>`;
    return this;
  }

  /**
   * Add a section to email content
   *
   * @param {*} data String
   * @param {*} customStyle Object
   *
   * @return self
   */

  section(data = '', customStyle?: string): IMailable {
    this._content += isNil(customStyle) ? `<div>${data}</div>` : `<div style="${customStyle}">${data}</div>`;
    return this;
  }

  /**
   * Add a CTA to email content
   *
   * @param {*} text String
   * @param {*} link String
   *
   * @return self
   */

  action(text = '', link = '#', type = 'default'): IMailable {
    this._content += `<div style="text-align:center">
                <a href="${link}">
                    <button style="${MailableDefaultStyle.button} ${MailableDefaultStyle.button_default}" class="${type}">${text}</button>
                </a>    
            </div>`;
    return this;
  }

  buildContent(): string {
    let html = `<html><body style="${MailableDefaultStyle.body}">`;
    html += `<div style="${MailableDefaultStyle.box}">`;
    html += isNil(this._customSubjectStyle)
      ? `<h1 style="${MailableDefaultStyle.subject}">${this._subject}</h1>`
      : `<h1 style="${MailableDefaultStyle.subject} ${this._customSubjectStyle}">${this._subject}</h1>`;
    if (this._greeting !== undefined && this._greeting !== '') {
      html += isNil(this._customGreetingStyle)
        ? `<div style="${MailableDefaultStyle.greeting}">${this._greeting}</div>`
        : `<div style="${MailableDefaultStyle.greeting} ${this._customGreetingStyle}">${this._greeting}</div>`;
    }
    html += `<div style="${MailableDefaultStyle.content}">${this._content}</div>`;
    html += '</div></body></html>';
    return html;
  }

  getParams(): IMailableNodeMailerParams {
    return {
      from: this._from_address,
      to: this._to_addresses.join(', '),
      subject: this._subject,
      html: this.buildContent(),
    };
  }
}
