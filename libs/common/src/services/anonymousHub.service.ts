import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  IHubProtocol,
} from "@microsoft/signalr";
import { MessagePackHubProtocol } from "@microsoft/signalr-protocol-msgpack";

import { AnonymousHubService as AnonymousHubServiceAbstraction } from "../abstractions/anonymousHub.service";
import { AuthService } from "../auth/abstractions/auth.service";
import { EnvironmentService } from "../platform/abstractions/environment.service";
import { LogService } from "../platform/abstractions/log.service";

import {
  AuthRequestPushNotification,
  NotificationResponse,
} from "./../models/response/notification.response";

export class AnonymousHubService implements AnonymousHubServiceAbstraction {
  private anonHubConnection: HubConnection;
  private url: string;
  private logHeartbeat = true;

  constructor(
    private environmentService: EnvironmentService,
    private authService: AuthService,
    private logService: LogService
  ) {}

  async createHubConnection(token: string) {
    this.url = this.environmentService.getNotificationsUrl();

    this.anonHubConnection = new HubConnectionBuilder()
      .withUrl(this.url + "/anonymous-hub?Token=" + token, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .withHubProtocol(new MessagePackHubProtocol() as IHubProtocol)
      .build();

    this.anonHubConnection.on("AuthRequestResponseRecieved", (data: any) => {
      this.ProcessNotification(new NotificationResponse(data));
    });

    // eslint-disable-next-line
    this.anonHubConnection.on("Heartbeat", (data: any) => {
      if (this.logHeartbeat) {
        const currentTime = new Date();
        console.log('Anon Heartbeat!', currentTime);
      }
    });

    this.anonHubConnection.on("error", (error) => {
      //const currentTime = new Date();
      console.log('Anon Connection generated error !!!', error);
    });

    await this.anonHubConnection.start().catch((error) => this.logService.error(error));
  }

  stopHubConnection() {
    if (this.anonHubConnection) {
      this.anonHubConnection.stop();
    }
  }

  private async ProcessNotification(notification: NotificationResponse) {
    await this.authService.authResponsePushNotification(
      notification.payload as AuthRequestPushNotification
    );
  }
}
