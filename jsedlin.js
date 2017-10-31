var stdin = WScript.StdIn;
var stdout = WScript.StdOut;
var ForReading = 1;
var ForWriting = 2;
var ForAppending = 8;
var FSO = new ActiveXObject("Scripting.FileSystemObject");
var buffer = [""];
main();

function main(){
	if(WScript.Arguments.Length == 0){
		stdout.WriteLine("E: no filename specified");
	}
	else{
		edlin(WScript.Arguments.Item(0));
	}
}

function edlin(filename){
	var fd = FSO.OpenTextFile(filename,ForReading,true);
	fd.Close();
	var size = FSO.GetFile(filename);
	stdout.Write(size.size+"C ");
	var breakflag = 0;
	var line = 0;
	loadbuffer(filename);
	stdout.WriteLine(buffer.length + "L");
	while(true){
		stdout.Write("*");
		var cmd = stdin.ReadLine();
		var tokens = cmd.split(",");
		switch(true){
			case (cmd=="q"):
				breakflag = 1;
				break;
			case (cmd==""):
				break;
			case (cmd=="l" || (tokens.length==2) && (tokens[1].charAt(tokens[1].length-1))=="l"):
				list(parsetokens(tokens));
				break;
			case (cmd=="a" || (tokens.length==2) && (tokens[1].charAt(tokens[1].length-1))=="a"):
				addtext(parsetokens(tokens));
				break;
			case (cmd=="w"):
				write(filename);
				break;
			case (cmd=="d" || (tokens.length==2) && (tokens[1].charAt(tokens[1].length-1))=="d"):
				deleteline(parsetokens(tokens));
				break;
			case (cmd=="s" || (tokens.length==2) && (tokens[1].charAt(tokens[1].length-1))=="s"):
				search(parsetokens(tokens));
				break;
			case (cmd=="r" || (tokens.length==2) && (tokens[1].charAt(tokens[1].length-1))=="r"):
				replace(parsetokens(tokens));
				break;
			case (cmd=="h"):
				help();
				break;
			default:
				stdout.WriteLine("E: bad command");
		}
		if(breakflag == 1){
			break;
		}
	}
	WScript.StdOut.Close();
	WScript.StdIn.Close();
}

function loadbuffer(filename){
	var count = 0;
	var fd = FSO.OpenTextFile(filename,ForReading,true);
	while (!fd.AtEndofStream){
		buffer[count]=fd.ReadLine();
		count++;
	}
	fd.Close();
}

function list(tokens){
	var startline = tokens[0]-1;
	var endline = tokens[1]-1;
	var count = startline;
	for (count=startline;count<=endline;count++){
		stdout.WriteLine(count+1 + ": " + buffer[count]);
	}
}

function addtext(tokens){
	var startline = tokens[0]-1;
	if(tokens[1] == buffer.length){
		var endline = Infinity;
	}
	else{
		var endline = tokens[1]-1;
	}
	var line = startline;
	for(line=startline;line<=endline;line++){
		stdout.write(line + 1 + ": ");
		var text = stdin.ReadLine();
		if(text=="."){
			break;
		}
		buffer[line] = text;
	}
}

function parsetokens(tokens){
	if(tokens.length==2 && tokens[1].charAt(0)=="$"){
		tokens[1] = tokens[1].replace("$",buffer.length.toString());
		tokens[1] = tokens[1].slice(0,tokens[1].length-1);
	}
	else if(tokens.length==2 && tokens[1].charAt(0)!="$"){
		tokens[1] = tokens[1].slice(0,tokens[1].length-1);
	}
	else{
		tokens.length=2;
		tokens[0]=1;
		tokens[1]=buffer.length;
	}
	return tokens;
}

function write(filename){
	var fd = FSO.OpenTextFile(filename,ForWriting,true);
	var count = 0;
	for(count=0;count<buffer.length;count++){
		fd.WriteLine(buffer[count]);
	}
	fd.Close();
	var size = FSO.GetFile(filename);
	stdout.WriteLine(size.size + "C " + buffer.length + "L");
}

function search(tokens){
	var startline=tokens[0]-1;
	var array=tokens[1].toString().split("?");
	var endline=array[0]-1;
	var searchtext=array[1];
	var count = startline;
	for (count=startline;count<=endline;count++){
		//search for text
		if(buffer[count].search(searchtext)!=-1){
			stdout.WriteLine(count+1+": "+buffer[count]);
		}
	}
}

function replace(tokens){
	//add stuff
	//delimiter is %%% three percent signs
	var startline=tokens[0]-1;
	var array=tokens[1].toString().split("?");
	var endline=array[0]-1;
	var sarray=array[1].toString().split("%%%");
	var searchtext=sarray[0];
	var replacetext=sarray[1];
	var count = startline;
	for (count=startline;count<=endline;count++){
		if(buffer[count].search(searchtext)!=-1){
			stdout.WriteLine(count+1+": "+buffer[count]);
			buffer[count] = buffer[count].replace(searchtext,replacetext);
			stdout.WriteLine(count+1+": "+buffer[count]);
		}
	}
}

function deleteline(tokens){
	var startline = tokens[0]-1;
	if (tokens[1]==tokens[0]){
		var endline = tokens[1]+1;
	}
	else{
		var endline = tokens[1];
	}
	var count = endline-startline;
	buffer.splice(startline,count);
}

function help(){
	var helptext = "[STARTLINE],[ENDLINE]a: add text from STARTLINE to ENDLINE\r\n";
	helptext += "[STARTLINE],[ENDLINE]l: list contents of file from STARTLINE to ENDLINE\r\n";
	helptext += "[STARTLINE],[ENDLINE]?[SEARCHTEXT]s: search for SEARCHTEXT from STARTLINE to ENDLINE\r\n";
	helptext += "[STARTLINE],[ENDLINE]?[SEARCHTEXT]%%%[REPLACETEXT]r: replace SEARCHTEXT with REPLACETEXT from STARTLINE to ENDLINE\r\n";
	helptext += "[STARTLINE],[ENDLINE]d: delete lines from STARTLINE to ENDLINE\r\n";
	helptext += "$: a wildcard that represents the last line of the file, can be used as ENDLINE in the above commands\r\n";
	helptext += "w: write buffer to file\r\n";
	helptext += "q: quit jsedlin\r\n";
	helptext += "h: show this help text\r\n";
	stdout.Write(helptext);
}
