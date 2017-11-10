:: Generate RELEASE for BABYTIMER application
:: by Frederic Huguenin, nov 9th 2017

@ECHO OFF
SET version="0.0.3"
SET built_dir=C:\Users\Fred\Documents\MyApp\babyTimer\platforms\android\build\outputs\apk
SET release_dir=C:\Users\Fred\Documents\MyApp\babyTimer\release
SET keystore_dir=C:\Users\Fred\Documents\MyApp\
SET keystore_file=myapp.keystore
SET config_xml_dir=C:\Users\Fred\Documents\MyApp\babyTimer
SET config_xml_file=config.xml

:: 1- CLEAN APK DIRECTORY
ECHO Clean APK directory
del /q "%built_dir%"
ECHO APK directory IS CLEARED


:: 2- SET VERSION
sed -i "s/version=.*xmlns/version=\"%version%\" xmlns/" "%config_xml_dir%\%config_xml_file%"

:: 3- BUILD RELEASE APK
ECHO RELEASE UNSIGNED built is in process ...
ionic build android --release



:: http://www.gnu.org/software/sed/manual/sed.html#The-_0022s_0022-Command

::sed
::sed 's/hello/world/' input.txt > output.txt   : replace all occurrences of ‘hello’ to ‘world’ in the file input.txt:
::sed -i 's/hello/world' file.txt  :  Use -i to edit files in-place instead of printing to standard output.
::. : Matches any character, including newline.
::a*b : Matches zero or more ‘a’s followed by a single ‘b’. For example, ‘b’ or ‘aaaaab’.


:: https://technet.microsoft.com/fr-fr/library/bb490890.aspx

::del 
::/p Prompts for confirmation before deleting the specified file.
::/f Forces deletion of read-only files.
::/s Deletes specified files from the current directory and all subdirectories. Displays the names of the files as they are being deleted.
::/q Specifies quiet mode. You are not prompted for delete confirmation.
::<Names> Specifies a list of one or more files or directories. Wildcards may be used to delete multiple files. If a directory is specified, all files within the ::directory will be deleted.

:: copy [/n] [{/y|/-y}] [/z] [{/a|/b}] Source [{/a|/b}] [+ Source [{/a|/b}] [+ ...]] [Destination [{/a|/b}]]
::/n   : Uses a short file name, if available, when copying a file with a name longer than eight characters, or with a file extension longer than three characters.
::/y   : Suppresses prompting to confirm that you want to overwrite an existing destination file.
::/-y   : Prompts you to confirm that you want to overwrite an existing destination file.
::/z   : Copies networked files in restartable mode.
::/a   : Indicates an ASCII text file.
::/b   : Indicates a binary file.
::Source   : Required. Specifies the location from which you want to copy a file or set of files. Source can consist of a drive letter and colon, a folder name, a file name, or a combination of these.
::Destination   : Required. Specifies the location to which you want to copy a file or set of files. Destination can consist of a drive letter and colon, a folder name, a file name, or a combination of these.

::if
::IF EXIST [filename] (
::) ELSE (
::)

