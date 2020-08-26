"use strict";
const accounts = use("App/Middleware/Storage");
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with accounts
 */
class AccountController {
  constructor() {
    this.accounts = [];
  }

  /**
   * Reset array of accounts.
   * POST accounts/reset
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async reset({ request, response, view }) {
    try {
      accounts.splice(0, accounts.length);

      return response.status(200).send("OK");
    } catch (error) {
      return response.status(500).send({ erro: { message: error } });
    }
  }

  /**
   * Display a single account.
   * GET accounts/balance
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async getBalance({ params, request, response, view }) {
    const accountId = request.only(["account_id"]);
    try {
      let balance = 0;
      var index = accounts.findIndex(
        (x) => x.destination.id === accountId.account_id
      );
      if (index === -1) {
        return response.status(404).send(balance);
      } else {
        accounts.forEach((element) => {
          if (element.destination.id === accountId.account_id) {
            balance = element.destination.balance;
          }
        });
      }
      return balance;
    } catch (error) {
      return response.status(500).send({ erro: { message: error } });
    }
  }
  /**
   * Create/save a new account.
   * POST accounts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async createAccount({ request, response }) {
    const data = request.only(["type", "destination", "amount", "origin"]);
    try {
      let obj = {};
      if (data.type == "deposit") {
        if (accounts.length === 0) {
          accounts.push({
            destination: { id: data.destination, balance: data.amount },
          });
          obj = accounts[accounts.length - 1];
        } else {
          accounts.forEach((element) => {
            if (element.destination.id === data.destination) {
              element.destination.balance =
                data.amount + element.destination.balance;
              obj = accounts[accounts.length - 1];
            } else {
              var index = accounts.findIndex(
                (x) => x.destination.id === data.destination
              );
              if (index === -1) {
                accounts.push({
                  destination: { id: data.destination, balance: data.amount },
                });
              }
              obj = accounts[accounts.length - 1];
            }
          });
        }
        return response.status(201).send(obj);
      } else if (data.type == "withdraw") {
        var index = accounts.findIndex((x) => x.destination.id === data.origin);
        if (index === -1) {
          return response.status(404).send(0);
        } else {
          accounts.forEach((element) => {
            if (element.destination.id === data.origin) {
              element.destination.balance =
                element.destination.balance - data.amount;

              obj = {
                origin: {
                  id: element.destination.id,
                  balance: element.destination.balance,
                },
              };
            }
          });
        }
        return response.status(201).send(obj);
      } else {
        var index = accounts.findIndex((x) => x.destination.id === data.origin);
        if (index === -1) {
          return response.status(404).send(0);
        } else {
          var destBalance = 0;
          var origBalance = 0;
          accounts.forEach((element) => {
            if (element.destination.id === data.origin) {
              element.destination.balance =
                element.destination.balance - data.amount;

              origBalance = element.destination.balance;
              destBalance = data.amount;

              obj = {
                origin: {
                  id: data.origin,
                  balance: origBalance,
                },
                destination: {
                  id: data.destination,
                  balance: destBalance,
                },
              };
            }
          });
        }
        return response.status(201).send(obj);
      }
    } catch (error) {
      return response.status(500).send({ erro: { message: error } });
    }
  }
}

module.exports = AccountController;
