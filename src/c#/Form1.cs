using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Threading;
using System.Net;
using System.IO;
using Newtonsoft.Json;
namespace WindowsFormsApplication1
{
    public partial class Form1 : Form
    {
        string domain = "http://pebblix-heroku.herokuapp.com";
        string id = "0";
        Dictionary<string, string> keys;
        string path = "serial.txt";
        Thread t;
        bool go = true;
        public Form1()
        {
            InitializeComponent();
        }
        public string getRequest(string requestUrl)
        {
            string s = "";
            HttpWebRequest http = (HttpWebRequest)HttpWebRequest.Create(domain+requestUrl);
            HttpWebResponse response = (HttpWebResponse)http.GetResponse();
            using (StreamReader sr = new StreamReader(response.GetResponseStream()))
            {
                s = sr.ReadToEnd();
            }
            return s;
        }
        void start()
        {
            string id = textBox1.Text;
            keys = JsonConvert.DeserializeObject<Dictionary<string, string>>(getRequest("/getKeys?serial=" + id));
            textBox2.Text = keys["top"];
            textBox3.Text = keys["mid"];
            textBox4.Text = keys["bot"];
            t = (new Thread(() =>
            {
                while (go)
                {
                    Console.WriteLine("GO");
                    string key = getRequest("/clicked?serial=" + id);
                    if (key != "nil")
                    {
                        SendKeys.Send(keys[key]);
                    }
                }
            }));
            t.Start();
            
        }
        private void Form1_Load(object sender, EventArgs e)
        {
            if (File.Exists(path))
            {
                textBox1.Text = File.ReadAllText(path);
                start();
            }
        }

        private void button1_Click(object sender, EventArgs e)
        {
            if(!File.Exists(path)){
                File.WriteAllText(path, textBox1.Text);
                if (t.IsAlive)
                    go = false;
                Thread.Sleep(5000);
                start();
            }
        }

        private void button2_Click(object sender, EventArgs e)
        {
            keys["top"] = textBox2.Text;
            keys["mid"] = textBox3.Text;
            keys["bot"] = textBox4.Text;
            getRequest("/updateKeys?serial=" + id + "&top=" + keys["top"] + "&mid=" + keys["mid"] + "&bot" + keys["bot"]);
        }

        private void Form1_FormClosing(object sender, FormClosingEventArgs e)
        {
            go = false;
        }
    }
}
