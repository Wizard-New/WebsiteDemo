#### finding subdomains

```shell
subfinder -d example.com -all -recursive |anew subdomains.txt
```

```shell
assetfinder --subs-only example.com | anew subdomains.txt
```

#### **Filtering live hosts with httpx**
```bash
cat subdomains.txt | httpx -td -title -sc -ip -ct -server -ports 80,443,8080,8000,8888 -threads 200| anew httpx_domains.txt 
```

```bash
cat httpx_domains.txt | awk '{print $1}' | anew live_subdomains.txt
```

### Finding URLs

Katana
```bash
katana -u live_subdomains.txt -d 5 -jc -kf all -fx -ef css -o katana_active.txt
```

```bash
katana -u subdomains_alive.txt -d 5 -ps -pss waybackarchive,commoncrawl,alienvault -kf -jc -fx -ef woff,css,png,svg,jpg,woff2,jpeg,gif,svg -o katana_passive.txt
```

Waybackurls
```bash
cat live_subdomains.txt | waybackurls | anew waybackurls.txt
```

Gau
```bash
cat live_subdomains.txt | gau | anew gau_urls.txt
```

all URLs
```bash
cat waymore.txt katana* waybackurls.txt gau_urls.txt | anew allurls.txt
```

### Finding sensitive files from crawled urls
```bash
grep -Eo 'https?://[^ ]+\.("xls|xml|xlsx|json|pdf|sql|doc|docx|pptx|txt|zip|targz|tgz|bak|7z|rar|log|cache|secret|db|backup|yml|gz|config|csv|yaml|md|md5|env|json|log|ini|conf|dbf|tar|gz|backup|swp|old|key|pem|crt|pfx|ppt")' allurls.txt
```

### Wordpress aggressive scanning

```bash
wpscan --url https://site.com --disable-tls-checks --api-token <here> -e at -e ap -e u --enumerate ap --plugins-detection aggressive --force
```

LFI Test
```bash
cat allurls.txt | gf lfi | uro | sed 's/=.*/=/' | qsreplace "FUZZ" | sort -u | xargs -I{} ffuf -u {} -w /usr/share/wordlists/seclists/Fuzzing/LFI/LFI-Jhaddix.txt -c -mr "root:(x|\*|\$[^\:]*):0:0:" -v
```

### Directory Bruteforce
DirSearch
```bash
dirsearch -u https://example.com -e php,cgi,htm,html,shtm,shtml,js,txt,bak,zip,old,conf,log,pl,asp,aspx,jsp,sql,db,sqlite,mdb,tar,gz,7z,rar,json,xml,yml,yaml,ini,java,py,rb,php3,php4,php5 --random-agent --recursive -R 3 -t 20 --exclude-status=404 --follow-redirects --delay=0.1
```

FFUF
```bash
ffuf -w /usr/share/wordlists/seclists/Discovery/Web-Content/directory-list-2.3-big.txt -u https://epicgames.com/FUZZ -fc 400,401,402,403,404,429,500,501,502,503 -recursion -recursion-depth 2 -e .html,.php,.txt,.pdf,.js,.css,.zip,.bak,.old,.log,.json,.xml,.config,.env,.asp,.aspx,.jsp,.gz,.tar,.sql,.db -ac -c -H "X-Forwarded-Host: localhost" -t 100 -r
```

JS File Hunting

```bash
cat allurls.txt | grep -E "\.js$" | anew alljs.txt
```

```bash
cat alljs.txt | nuclei -t  ~/nuclei-templates/http/exposures/
```
