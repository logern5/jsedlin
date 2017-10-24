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
			default:
				stdout.WriteLine("E: bad command");
		}
		if(breakflag == 1){
			break;
		}
	}
	WScript.StdIn.Close();
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
		stdout.WriteLine(buffer[count]);
	}
}

function addtext(tokens){
	var startline = tokens[0]-1;
	if(tokens[1] == buffer.length-1){
		var endline=Infinity;
	}
	else{
		var endline = tokens[1];
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
	if(tokens.length==2){
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
