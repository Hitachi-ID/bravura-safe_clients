import * as fs from "fs";
import * as path from "path";

import * as chalk from "chalk";
import * as program from "commander";

import { Utils } from "@bitwarden/common/platform/misc/utils";
import { SendType } from "@bitwarden/common/tools/send/enums/send-type";

import { Main } from "../../bw";
import { GetCommand } from "../../commands/get.command";
import { Response } from "../../models/response";
import { Program } from "../../program";
import { CliUtils } from "../../utils";

import {
  SendCreateCommand,
  SendDeleteCommand,
  SendEditCommand,
  SendGetCommand,
  SendListCommand,
  SendReceiveCommand,
  SendRemovePasswordCommand,
} from "./commands";
import { SendFileResponse } from "./models/send-file.response";
import { SendTextResponse } from "./models/send-text.response";
import { SendResponse } from "./models/send.response";

const writeLn = CliUtils.writeLn;

export class SendProgram extends Program {
  constructor(main: Main) {
    super(main);
  }

  async register() {
    program.addCommand(this.sendCommand());
    // receive is accessible both at `bsafe receive` and `bsafe share receive`
    program.addCommand(this.receiveCommand());
  }

  private sendCommand(): program.Command {
    return new program.Command("share")
      .arguments("<data>")
      .description(
        "Work with Bravura Safe Shares. A Share can be quickly created using this command or subcommands can be used to fine-tune the Share.",
        {
          data: "The data to share. Specify as a filepath with the --file option",
        }
      )
      .option("-f, --file", "Specifies that <data> is a filepath")
      .option(
        "-d, --deleteInDays <days>",
        "The number of days in the future to set deletion date, defaults to 7",
        "7"
      )
      .option("-a, --maxAccessCount <amount>", "The amount of max possible accesses.")
      .option("--hidden", "Hide <data> in web by default. Valid only if --file is not set.")
      .option(
        "-n, --name <name>",
        "The name of the Share. Defaults to a guid for text Shares and the filename for files."
      )
      .option("--notes <notes>", "Notes to add to the Share.")
      .option(
        "--fullObject",
        "Specifies that the full Share object should be returned rather than just the access url."
      )
      .addCommand(this.listCommand())
      .addCommand(this.templateCommand())
      .addCommand(this.getCommand())
      .addCommand(this.receiveCommand())
      .addCommand(this.createCommand())
      .addCommand(this.editCommand())
      .addCommand(this.removePasswordCommand())
      .addCommand(this.deleteCommand())
      .action(async (data: string, options: program.OptionValues) => {
        const encodedJson = this.makeSendJson(data, options);

        let response: Response;
        if (encodedJson instanceof Response) {
          response = encodedJson;
        } else {
          response = await this.runCreate(encodedJson, options);
        }

        this.processResponse(response);
      });
  }

  private receiveCommand(): program.Command {
    return new program.Command("receive")
      .arguments("<url>")
      .description("Access a Bravura Safe Share from a url.")
      .option("--password <password>", "Password needed to access the Share.")
      .option("--passwordenv <passwordenv>", "Environment variable storing the Share's password")
      .option(
        "--passwordfile <passwordfile>",
        "Path to a file containing the Shares password as its first line"
      )
      .option("--obj", "Return the Share's json object rather than the Share's content")
      .option("--output <location>", "Specify a file path to save a File-type Share to")
      .on("--help", () => {
        writeLn("");
        writeLn(
          "If a password is required, the provided password is used or the user is prompted."
        );
        writeLn("", true);
      })
      .action(async (url: string, options: program.OptionValues) => {
        const cmd = new SendReceiveCommand(
          this.main.apiService,
          this.main.cryptoService,
          this.main.cryptoFunctionService,
          this.main.platformUtilsService,
          this.main.environmentService,
          this.main.sendApiService
        );
        const response = await cmd.run(url, options);
        this.processResponse(response);
      });
  }

  private listCommand(): program.Command {
    return new program.Command("list")

      .description("List all the Shares owned by you")
      .on("--help", () => {
        writeLn(chalk("This is in the list command"));
      })
      .action(async (options: program.OptionValues) => {
        await this.exitIfLocked();
        const cmd = new SendListCommand(
          this.main.sendService,
          this.main.environmentService,
          this.main.searchService
        );
        const response = await cmd.run(options);
        this.processResponse(response);
      });
  }

  private templateCommand(): program.Command {
    return new program.Command("template")
      .arguments("<object>")
      .description("Get json templates for share objects", {
        object: "Valid objects are: send.text, send.file",
      })
      .action(async (object) => {
        const cmd = new GetCommand(
          this.main.cipherService,
          this.main.folderService,
          this.main.collectionService,
          this.main.totpService,
          this.main.auditService,
          this.main.cryptoService,
          this.main.stateService,
          this.main.searchService,
          this.main.apiService,
          this.main.organizationService
        );
        const response = await cmd.run("template", object, null);
        this.processResponse(response);
      });
  }

  private getCommand(): program.Command {
    return new program.Command("get")
      .arguments("<id>")
      .description("Get Shares owned by you.")
      .option("--output <output>", "Output directory or filename for attachment.")
      .option("--text", "Specifies to return the text content of a Share")
      .on("--help", () => {
        writeLn("");
        writeLn("  Id:");
        writeLn("");
        writeLn("    Search term or Share's globally unique `id`.");
        writeLn("");
        writeLn("    If raw output is specified and no output filename or directory is given for");
        writeLn("    an attachment query, the attachment content is written to stdout.");
        writeLn("");
        writeLn("  Examples:");
        writeLn("");
        writeLn("    bsafe share get searchText");
        writeLn("    bsafe share get id");
        writeLn("    bsafe share get searchText --text");
        writeLn("    bsafe share get searchText --file");
        writeLn("    bsafe share get searchText --file --output ../Photos/photo.jpg");
        writeLn("    bsafe share get searchText --file --raw");
        writeLn("", true);
      })
      .action(async (id: string, options: program.OptionValues) => {
        await this.exitIfLocked();
        const cmd = new SendGetCommand(
          this.main.sendService,
          this.main.environmentService,
          this.main.searchService,
          this.main.cryptoService
        );
        const response = await cmd.run(id, options);
        this.processResponse(response);
      });
  }

  private createCommand(): program.Command {
    return new program.Command("create")
      .arguments("[encodedJson]")
      .description("create a Share", {
        encodedJson: "JSON object to upload. Can also be piped in through stdin.",
      })
      .option("--file <path>", "file to share. Can also be specified in parent's JSON.")
      .option("--text <text>", "text to share. Can also be specified in parent's JSON.")
      .option("--hidden", "text hidden flag. Valid only with the --text option.")
      .option(
        "--password <password>",
        "optional password to access this Share. Can also be specified in JSON"
      )
      .on("--help", () => {
        writeLn("");
        writeLn("Note:");
        writeLn("  Options specified in JSON take precedence over command options");
        writeLn("", true);
      })
      .action(
        async (
          encodedJson: string,
          options: program.OptionValues,
          args: { parent: program.Command }
        ) => {
          // Work-around to support `--fullObject` option for `share create --fullObject`
          // Calling `option('--fullObject', ...)` above won't work due to Commander doesn't like same option
          // to be defind on both parent-command and sub-command
          const { fullObject = false } = args.parent.opts();
          const mergedOptions = {
            ...options,
            fullObject: fullObject,
          };

          const response = await this.runCreate(encodedJson, mergedOptions);
          this.processResponse(response);
        }
      );
  }

  private editCommand(): program.Command {
    return new program.Command("edit")
      .arguments("[encodedJson]")
      .description("edit a Share", {
        encodedJson:
          "Updated JSON object to save. If not provided, encodedJson is read from stdin.",
      })
      .option("--itemid <itemid>", "Overrides the itemId provided in [encodedJson]")
      .on("--help", () => {
        writeLn("");
        writeLn("Note:");
        writeLn("  You cannot update a File-type Share's file. Just delete and remake it");
        writeLn("", true);
      })
      .action(async (encodedJson: string, options: program.OptionValues) => {
        await this.exitIfLocked();
        const getCmd = new SendGetCommand(
          this.main.sendService,
          this.main.environmentService,
          this.main.searchService,
          this.main.cryptoService
        );
        const cmd = new SendEditCommand(
          this.main.sendService,
          this.main.stateService,
          getCmd,
          this.main.sendApiService
        );
        const response = await cmd.run(encodedJson, options);
        this.processResponse(response);
      });
  }

  private deleteCommand(): program.Command {
    return new program.Command("delete")
      .arguments("<id>")
      .description("delete a Share", {
        id: "The id of the Share to delete.",
      })
      .action(async (id: string) => {
        await this.exitIfLocked();
        const cmd = new SendDeleteCommand(this.main.sendService, this.main.sendApiService);
        const response = await cmd.run(id);
        this.processResponse(response);
      });
  }

  private removePasswordCommand(): program.Command {
    return new program.Command("remove-password")
      .arguments("<id>")
      .description("removes the saved password from a Share.", {
        id: "The id of the Share to alter.",
      })
      .action(async (id: string) => {
        await this.exitIfLocked();
        const cmd = new SendRemovePasswordCommand(this.main.sendService, this.main.sendApiService);
        const response = await cmd.run(id);
        this.processResponse(response);
      });
  }

  private makeSendJson(data: string, options: program.OptionValues) {
    let sendFile = null;
    let sendText = null;
    let name = Utils.newGuid();
    let type = SendType.Text;
    if (options.file != null) {
      data = path.resolve(data);
      if (!fs.existsSync(data)) {
        return Response.badRequest("data path does not exist");
      }

      sendFile = SendFileResponse.template(data);
      name = path.basename(data);
      type = SendType.File;
    } else {
      sendText = SendTextResponse.template(data, options.hidden);
    }

    const template = Utils.assign(SendResponse.template(null, options.deleteInDays), {
      name: options.name ?? name,
      notes: options.notes,
      file: sendFile,
      text: sendText,
      type: type,
    });

    return Buffer.from(JSON.stringify(template), "utf8").toString("base64");
  }

  private async runCreate(encodedJson: string, options: program.OptionValues) {
    await this.exitIfLocked();
    const cmd = new SendCreateCommand(
      this.main.sendService,
      this.main.stateService,
      this.main.environmentService,
      this.main.sendApiService
    );
    return await cmd.run(encodedJson, options);
  }
}
