const functions = require("firebase-functions");
const admin = require("firebase-admin");
require("dotenv").config();
const line = require("@line/bot-sdk");
// import * as crypto from "crypto";

admin.initializeApp();
// const db = admin.firestore();


exports.scheduledFunc = functions
    .region("asia-northeast1")
    .pubsub.schedule("every 1 minutes")
    .onRun(async (context) => {
      //         console.info("5分毎に実行！");
      //         return;
      //     });

      // exports.lineBot = functions
      //     .region("asia-northeast1")
      //     .https.onRequest(async (request, response) => {
      // const stringBody = JSON.stringify(request.body);
      // const events = request.body.events[0];
      // const headers = request.headers;

      // Verify signature
      // const signature = await crypto
      //     .createHmac("SHA256", channelSecret)
      //     .update(stringBody).digest("base64");

      // if (signature !== headers["x-line-signature"]
      // || events === undefined) {
      //   response.status(200).send();
      //   throw new Error("Event denied");
      // }


      // const replyToken = events.replyToken;
      // const userId = events.source.userId;
      const client = new line.Client({
        channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
        channelSecret: process.env.CHANNEL_SECRET,
      });

      // const replyText = (messageFromUser) => {
      //   const replyMessage = () => {
      //     switch (messageFromUser) {
      //       case "おはよう":
      //         return "おはようございます！今日も一日頑張りましょう";
      //       case "こんにちは":
      //         return "こんにちは！良い天気ですね";
      //       case "こんばんは":
      //         return "こんばんは！夕飯は食べましたか？";
      //       default:
      //         return "なるほど！";
      //     }
      //   };
      //   return `${replyMessage()}`;
      // };

      // const textMessage = {
      //   type: "text",
      //   text: "がんばれオレ！",
      // };

      const textMessage ={
        "type": "flex",
        "altText": "this is a flex message",
        "contents": {
          "type": "bubble",
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "今週はご家族と連絡とった？",
                "weight": "bold",
                "size": "md",
              },
            ],
          },
          "footer": {
            "type": "box",
            "layout": "vertical",
            "spacing": "sm",
            "contents": [
              {
                "type": "button",
                "style": "link",
                "height": "sm",
                "action": {
                  "type": "message",
                  "label": "はい",
                  "text": "はい",
                },
              },
              {
                "type": "button",
                "style": "link",
                "height": "sm",
                "action": {
                  "type": "message",
                  "label": "いいえ",
                  "text": "いいえ",
                },
              },
              {
                "type": "box",
                "layout": "vertical",
                "contents": [],
                "margin": "sm",
              },
            ],
            "flex": 0,
            "borderWidth": "medium",
          },
          "styles": {
            "body": {
              "backgroundColor": "#FDDDDE",
            },
          },
        },
      };


      client.broadcast(textMessage)
          .then(() => {
            functions.logger.log("sent the message!");
          })
          .catch((err) => {
            functions.logger.error(err);
          });
      // response.status(200).send();
    });

exports.lineBot = functions
    .region("asia-northeast1")
    .https.onRequest(async (request, response) => {
      // const stringBody = JSON.stringify(request.body);
      const events = request.body.events[0];
      // const headers = request.headers;

      // Verify signature
      // const signature = await crypto
      //     .createHmac("SHA256", channelSecret)
      //     .update(stringBody).digest("base64");

      // if (signature !== headers["x-line-signature"]
      // || events === undefined) {
      //   response.status(200).send();
      //   throw new Error("Event denied");
      // }


      const replyToken = events.replyToken;
      // const userId = events.source.userId;
      const client = new line.Client({
        channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
        channelSecret: process.env.CHANNEL_SECRET,
      });

      // 提案する話題
      const messageArray = [
        "健康面で気になることなど、体調について聞いてみましょう。",
        "困りごとや心配事はないか聞いてみましょう。",
        "不審な電話や訪問がないか聞いてみましょう。",
        "どのくらい歩いているかや外出の頻度について聞いてみましょう",
        "きちんと食べているかなど、食事について話してみましょう。",
        "最近の美味しかったご飯の写真を送ってみましょう。",
        "最近行って良かった場所の写真を送ってみましょう。",
        "今度行ってみたい場所について話してみましょう。",
        "心が和むような話やニュースはありませんか？ぜひ話してみましょう。",
        "事件や事故など不安なニュースはありませんか？ぜひ話してみましょう。"];
      // 返す話題を選ぶための乱数
      const numberOfSelectedMsg =
        Math.floor(Math.random() * (messageArray.length + 1));

      const replyText = (messageFromUser) => {
        const replyMessage = () => {
          switch (messageFromUser) {
            case "はい":
              return "その調子です。きっとご家族も喜んでいますよ。";
            case "いいえ":
              return `少しのお時間でも、きっと喜ばれますよ。${messageArray[numberOfSelectedMsg]}`;
            default:
              return "ごめんなさい。そのメッセージにはお答えできません。";
          }
        };
        return `${replyMessage()}`;
      };

      const textMessage = {
        type: "text",
        text: replyText(events.message.text),
      };

      client.replyMessage(replyToken, textMessage)
          .then(() => {
            functions.logger.log("Replied to the message!");
          })
          .catch((err) => {
            functions.logger.error(err);
          });
      response.status(200).send();
    });


exports.fetchFriendsData =
  functions.https.onRequest(async (request, response) => {
  // GETリクエストではない場合
    if (request.method !== "GET") {
      response.status(400).send("リクエストタイプが不正です");
    }
    // クエリがない場合
    // 本来は、クエリのバリデーションも必要。userRecordがパラメータ
    const query = request.query.userRecord;
    if (query===undefined) {
      response.status(400).send("クエリが不正です");
    }

    try {
      const db = admin.firestore();
      const doc =
        await
        db.collection("users-record")
            .doc("jjnNYAZZYNR2CrcE9gB4lClBjFn1").get();

      const userInfo = doc.data();
      response.send(userInfo);
    } catch (e) {
      console.error(e);
      response.status(500).send(e);
    }
  });

exports.addFriendData = functions.https.onRequest(async (request, response) => {
  // POSTリクエストではない場合
  if (request.method !== "POST") {
    response.status(400).send("リクエストタイプが不正です");
  }

  // bodyがない場合
  // 本来は、bodyのバリデーションも必要
  const body = request.body;
  if (body === undefined) {
    response.status(400).send("bodyの中身が不正です");
  }

  const userRecordIdKey = Object.keys(body)[0];
  const userRecordId = body[userRecordIdKey];

  try {
    const db = admin.firestore();
    await
    db.collection("users-record")
        .doc(userRecordIdKey)
        .set({userRecordId}, {merge: true});

    response.send("Complete");
  } catch (e) {
    console.error(e);
    response.status(500).send(e);
  }
});


// onCreate新しく追加されたら発火
// subcollectionのsentRequestsにデータが追加されたら、onCreateメソッドが呼び出される
// exports.onFriendRequest =
//   functions.firestore
//       .document("users-record / { documentid }")
//       .onCreate(async (snapshot, context) => {
//         // 新規追加された値
//         const newFriendRequest = snapshot.data();
//         console.log(newFriendRequest);
//         console.log(context);
//       });

// exports.helloWorld = functions.https.onRequest(async (req, res) => {
//   const events = req.body.events;
//   // const client = new line.Client({
//   //   channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
//   //   channelSecret: process.env.CHANNEL_SECRET,
//   // });
//   const result =
//     await client
//         .replyMessage(events[0].replyToken, {type: "text", text: "領域展開！！"});
//   res.json(result);
// });
