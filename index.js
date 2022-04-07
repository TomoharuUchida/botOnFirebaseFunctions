const functions = require("firebase-functions");
const admin = require("firebase-admin");
require("dotenv").config();
const line = require("@line/bot-sdk");
// import * as crypto from "crypto";

admin.initializeApp();
// const db = admin.firestore();

// タイマーで実行されるプッシュメッセージの送信
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

      // 「はい」か「いいえ」を選択するflex message
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


// ユーザーから送られたメッセージに応答する
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

      // 単純なテキストメッセージで応答（話題の提供）をする
      // 提案する話題
      /* const messageArray = [
        "健康面で気になることなど、体調について聞いてみましょう。",
        "困りごとや心配事はないか聞いてみましょう。",
        "不審な電話や訪問がないか聞いてみましょう。",
        "どのくらい歩いているかや外出の頻度について聞いてみましょう",
        "きちんと食べているかなど、食事について話してみましょう。",
        "最近の美味しかったご飯の写真を送ってみましょう。",
        "最近行って良かった場所の写真を送ってみましょう。",
        "今度行ってみたい場所について話してみましょう。",
        "心が和むような話やニュースはありませんか？ぜひ話してみましょう。",
        "事件や事故など不安なニュースはありませんか？ぜひ話してみましょう。"];*/

      // 返す話題を選ぶための乱数
      // const numberOfSelectedMsg =
      //   Math.floor(Math.random() * (messageArray.length + 1));

      // 返信用のメッセージ
      // 連絡取ってるか「はい」への応答
      const replyCaseYes = {
        "type": "text",
        "text": "その調子で頑張って！声を聞かせたり、元気な姿を見せるのは、あなたが思う以上に嬉しいものよ $",
        "emojis": [
          {
            "index": 45,
            "productId": "5ac1bfd5040ab15980c9b435",
            "emojiId": "044",
          },
        ],
      };

      const replyCaseYesStamp =
       {
         "type": "sticker",
         "packageId": "8515",
         "stickerId": "16581242",
       };
      // 連絡取ってるか「いいえ」への応答
      const replyCaseNoStamp =
       {
         "type": "sticker",
         "packageId": "1070",
         "stickerId": "17866",
       };
      // 選択肢のflex message
      const replyCaseNoSelectbox = {
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
                "text": "理由は何かしら？",
                "weight": "bold",
                "size": "md",
              },
            ],
          },
          "footer": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "button",
                "action": {
                  "type": "message",
                  "label": "なんとなく・・・",
                  "text": "なんとなく・・・",
                },
              },
              {
                "type": "button",
                "action": {
                  "type": "message",
                  "label": "時間がなかった・・・",
                  "text": "時間がなかった・・・",
                },
              },
              {
                "type": "button",
                "action": {
                  "type": "message",
                  "label": "今回は大丈夫！",
                  "text": "今回は大丈夫！",
                },
              },
            ],
          },
          "styles": {
            "body": {
              "backgroundColor": "#FDDDDE",
            },
          },
        },
      };

      // 連絡取ってるか「なんとなく・・・」への応答
      const replyCaseSomehow = {
        "type": "text",
        "text": "「便りの無いのは良い便り」とは言っても、ちょっとしたコミュニケーションで気づくこともあるのよ $",
        "emojis": [
          {
            "index": 47,
            "productId": "5ac1bfd5040ab15980c9b435",
            "emojiId": "043",
          },
        ],
      };
      // 理由を聞くflex message
      const replyCaseSomohowSelectbox = {
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
                "text": "よかったらご家族に聞いてみたら？",
                "weight": "bold",
                "size": "md",
              },
            ],
          },
          "footer": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "button",
                "action": {
                  "type": "message",
                  "label": "体調のこと",
                  "text": "体調のこと",
                },
              },
              {
                "type": "button",
                "action": {
                  "type": "message",
                  "label": "食事のこと",
                  "text": "食事のこと",
                },
              },
              {
                "type": "button",
                "action": {
                  "type": "message",
                  "label": "運動のこと",
                  "text": "運動のこと",
                },
              },
              {
                "type": "button",
                "action": {
                  "type": "message",
                  "label": "困りごと",
                  "text": "困りごと",
                },
              },
              {
                "type": "button",
                "action": {
                  "type": "message",
                  "label": "心配事",
                  "text": "心配事",
                },
              },
            ],
          },
          "styles": {
            "body": {
              "backgroundColor": "#FDDDDE",
            },
          },
        },
      };

      // 連絡取ってるか「時間がなかった・・・」への応答
      const replyCaseBusy = {
        "type": "text",
        "text": "だいたいみんなそうよね $\nおいしかったご飯の写真とか送るだけでもいいと思うよ $",
        "emojis": [
          {
            "index": 12,
            "productId": "5ac1bfd5040ab15980c9b435",
            "emojiId": "053",
          },
          {
            "index": 40,
            "productId": "5ac1bfd5040ab15980c9b435",
            "emojiId": "074",
          },
        ],
      };

      const replyCaseBusyStamp =
       {
         "type": "sticker",
         "packageId": "6325",
         "stickerId": "10979917",
       };
      // 連絡取ってるか「今回は大丈夫！」への応答
      const replyCaseSkip = {
        "type": "text",
        "text": "目標は月2回よ $",
        "emojis": [
          {
            "index": 8,
            "productId": "5ac21e6c040ab15980c9b444",
            "emojiId": "011",
          },
        ],
      };

      const replyCaseSkipStamp =
       {
         "type": "sticker",
         "packageId": "6325",
         "stickerId": "10979926",
       };

      // 「体調のこと」への応答
      const replyAdviceHealth = {
        "type": "text",
        "text": "「最近、腰の調子はどう？」みたいに、さりげなーく聞くのがポイント\n突然改まって聞くと逆に不安にさせるわよ",
      };
      // 「食事のこと」への応答
      const replyAdviceMeal = {
        "type": "text",
        "text": "食べる時間が不規則だったり、食べなかったりしてるかも\n気にしてみてね",
      };
      // 「運動のこと」への応答
      const replyAdviceExercise = {
        "type": "text",
        "text": "理想は「30分以上の運動を週2日以上」らしいわよ\n軽い散歩でいいからやってほしい",
      };
      // 「困りごと」への応答
      const replyAdviceProblems = {
        "type": "text",
        "text":
           "重い物を運ぶとか、買い物とか、ちょっとしたことが難しくなるのよね\n帰省した時に手伝ったり、通販で買って贈ってあげるとかもいいかも",
      };
      // 「心配事」への応答
      const replyAdviceWorry = {
        "type": "text",
        "text": "詐欺とか事故多いわよね\nニュースを見た時とかに連絡をとると、ご家族もきっと安心するわよ",
      };
      // 想定外への応答
      const replyUnexpected = {
        "type": "text",
        "text": "ごめん、それはよくわからないわ $",
        "emojis": [
          {
            "index": 16,
            "productId": "5ac1bfd5040ab15980c9b435",
            "emojiId": "010",
          },
        ],
      };


      // 送信メッセージを入れる空の配列
      const textMessage = [];

      const replyMessage = (messageFromUser) => {
        switch (messageFromUser) {
          case "はい":
            return textMessage.push(replyCaseYesStamp, replyCaseYes);
          case "いいえ":
            return textMessage.push(replyCaseNoStamp, replyCaseNoSelectbox);
          case "なんとなく・・・":
            return textMessage.push(
                replyCaseSomehow,
                replyCaseSomohowSelectbox);
          case "時間がなかった・・・":
            return textMessage.push(
                replyCaseBusyStamp,
                replyCaseBusy);
          case "今回は大丈夫！":
            return textMessage.push(replyCaseSkipStamp, replyCaseSkip);
          case "体調のこと":
            return textMessage.push(replyAdviceHealth);
          case "食事のこと":
            return textMessage.push(replyAdviceMeal);
          case "運動のこと":
            return textMessage.push(replyAdviceExercise);
          case "困りごと":
            return textMessage.push(replyAdviceProblems);
          case "心配事":
            return textMessage.push(replyAdviceWorry);
          default:
            return textMessage.push(replyUnexpected);
        }
      };

      replyMessage(events.message.text);

      // const textMessage = {
      //   type: "text",
      //   text: "がんばれオレ！",
      // };


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
