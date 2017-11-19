from bs4 import BeautifulSoup
import urllib2
import json
import sys


def getUsersFromTweet(tweetId, ulist, user, maximum, tots):
    i = 0;
    response = urllib2.urlopen('https://twitter.com/' +user + '/status/'+tweetId)
    html = response.read()
    soup = BeautifulSoup(html, 'html.parser')

    myusers= soup.findAll("a", { "class" : "js-user-profile-link" })
    for elem in myusers:
        uname = elem["href"].replace("/","")
        if uname != user and not (uname in tots):
            i = i+1
            tots.append(uname)
            ulist.append({"name":uname, "children":[]})
            if i == maximum:
                for i in ulist:
                    print i["name"]
                break

def getUsersFromUser(user, ulist, tots):
    response = urllib2.urlopen('https://twitter.com/'+user)
    html = response.read()
    soup = BeautifulSoup(html, 'html.parser')

    tweets = soup.findAll("li", { "class" : "stream-item" })
    for elem in tweets:
        getUsersFromTweet(elem["data-item-id"], ulist, user, 5-len(ulist), tots)
        if len(ulist)==5:
            break


def complete(data, nivells, tots):
    getUsersFromUser(data["name"], data["children"], tots)
    if nivells == 0:
        return
    else:
        nivells = nivells -1
        print str(nivells)
        a = 0
        for i in data["children"]:
            a += 1
            complete(i, nivells, tots)




data = {"name":sys.argv[1], "children":[], "depth":0, "height":0}
tots = [sys.argv[1]]
nivells =int(sys.argv[2])
complete(data, nivells, tots)

with open('./views/flare.json', 'w') as fp:
    json.dump(data, fp)
